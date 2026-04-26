const express = require('express');

const { paginate, now } = require('./_helpers');
const { store, projectSummary, getProjectById } = require('./_store');

const router = express.Router();
const deletedMilestones = [];

function normalizeMilestoneId(entry, index) {
  const numericId = Number(entry.id);
  if (Number.isFinite(numericId) && numericId > 0) {
    return numericId;
  }

  const midMatch = /^M(\d+)$/i.exec(String(entry.mid || ''));
  if (midMatch) {
    return Number(midMatch[1]);
  }

  return index + 1;
}

function nextMilestoneId() {
  const nums = store.milestones.map((entry, index) => normalizeMilestoneId(entry, index));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return max + 1;
}

function ensureMilestoneIds() {
  store.milestones = store.milestones.map((entry, index) => ({
    ...entry,
    id: normalizeMilestoneId(entry, index)
  }));
}

function matchesMilestone(entry, identifier) {
  return String(entry.id) === String(identifier) || String(entry.mid) === String(identifier);
}

ensureMilestoneIds();

function withProjectFields(entry) {
  const summary = projectSummary(entry.project);
  return {
    ...entry,
    project_title: summary.title,
    project_details: getProjectById(entry.project) || null
  };
}

router.get('/', (req, res) => {
  const { project, status, is_completed, name } = req.query;

  const list = store.milestones.filter((entry) => {
    if (project && entry.project !== Number(project)) return false;
    if (status && entry.status !== status) return false;
    if (name && !entry.name.toLowerCase().includes(String(name).toLowerCase())) return false;
    if (is_completed !== undefined) {
      const expected = String(is_completed) === 'true';
      if (Boolean(entry.is_completed) !== expected) return false;
    }
    return true;
  });

  res.json(paginate(list.map(withProjectFields), req));
});

router.post('/', (req, res) => {
  const { project, name, start_date, end_date, status, description, proposed_end_date, type } = req.body || {};

  if (!project || !name || !start_date || !end_date || !status) {
    return res.status(400).json({ error: 'project, name, start_date, end_date and status are required' });
  }

  const resolvedId = nextMilestoneId();
  const resolvedMid = req.body?.mid || `M${String(resolvedId).padStart(3, '0')}`;
  if (store.milestones.some((entry) => entry.id === resolvedId || entry.mid === resolvedMid)) {
    return res.status(400).json({ error: `milestone id '${resolvedId}' already exists` });
  }

  const entry = {
    id: resolvedId,
    mid: resolvedMid,
    project: Number(project),
    name,
    type: type || 'MP',
    description: description || '',
    start_date,
    end_date,
    proposed_end_date: proposed_end_date || null,
    status,
    is_completed: status === 'Completed',
    duration_days: Math.max(0, Math.ceil((new Date(end_date) - new Date(start_date)) / 86400000)),
    created: now(),
    last_modified: now()
  };

  store.milestones.push(entry);
  res.status(201).json(withProjectFields(entry));
});

router.get('/completed/', (req, res) => {
  const list = store.milestones.filter((entry) => entry.status === 'Completed');
  res.json(list.map(withProjectFields));
});

router.get('/in_progress/', (req, res) => {
  const list = store.milestones.filter((entry) => entry.status === 'In Progress');
  res.json(list.map(withProjectFields));
});

router.get('/:mid/', (req, res) => {
  const entry = store.milestones.find((item) => matchesMilestone(item, req.params.mid));
  if (!entry) return res.status(404).json({ detail: 'Not found.' });
  res.json(withProjectFields(entry));
});

router.put('/:mid/', (req, res) => {
  const index = store.milestones.findIndex((item) => matchesMilestone(item, req.params.mid));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.milestones[index];
  const updated = {
    ...existing,
    ...req.body,
    mid: existing.mid,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };
  updated.is_completed = updated.status === 'Completed';
  if (updated.start_date && updated.end_date) {
    updated.duration_days = Math.max(
      0,
      Math.ceil((new Date(updated.end_date) - new Date(updated.start_date)) / 86400000)
    );
  }

  store.milestones[index] = updated;
  res.json(withProjectFields(updated));
});

router.patch('/:mid/', (req, res) => {
  const index = store.milestones.findIndex((item) => matchesMilestone(item, req.params.mid));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.milestones[index];
  const updated = {
    ...existing,
    ...req.body,
    mid: existing.mid,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };
  updated.is_completed = updated.status === 'Completed';
  if (updated.start_date && updated.end_date) {
    updated.duration_days = Math.max(
      0,
      Math.ceil((new Date(updated.end_date) - new Date(updated.start_date)) / 86400000)
    );
  }

  store.milestones[index] = updated;
  res.json(withProjectFields(updated));
});

router.delete('/:mid/', (req, res) => {
  const index = store.milestones.findIndex((item) => matchesMilestone(item, req.params.mid));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const [deleted] = store.milestones.splice(index, 1);
  deletedMilestones.push(deleted);
  res.status(204).send();
});

router.post('/:mid/restore/', (req, res) => {
  const deletedIndex = deletedMilestones.findIndex((item) => matchesMilestone(item, req.params.mid));
  if (deletedIndex === -1) return res.status(404).json({ detail: 'Not found.' });

  const [restored] = deletedMilestones.splice(deletedIndex, 1);
  store.milestones.push(restored);
  res.json(withProjectFields(restored));
});

module.exports = router;
