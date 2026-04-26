const express = require('express');

const { paginate, nextId, now } = require('./_helpers');
const { store, projectSummary } = require('./_store');

const router = express.Router();

router.get('/', (req, res) => {
  const { project, name, value } = req.query;

  const list = store.statuses.filter((entry) => {
    if (project && entry.project !== Number(project)) return false;
    if (name && entry.name !== name) return false;
    if (value && entry.value !== value) return false;
    return true;
  });

  res.json(paginate(list, req));
});

router.post('/', (req, res) => {
  const { project, name, value, description } = req.body || {};
  if (!project || !name) return res.status(400).json({ error: 'project and name are required' });

  const { title } = projectSummary(project);
  const entry = {
    id: nextId(store.statuses),
    project: Number(project),
    project_title: title,
    name,
    value: value || 'Gray',
    description: description || '',
    created: now(),
    last_modified: now()
  };

  store.statuses.push(entry);
  res.status(201).json(entry);
});

router.get('/:id/', (req, res) => {
  const entry = store.statuses.find((item) => item.id === Number(req.params.id));
  if (!entry) return res.status(404).json({ detail: 'Not found.' });
  res.json(entry);
});

router.put('/:id/', (req, res) => {
  const index = store.statuses.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.statuses[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };

  store.statuses[index] = updated;
  res.json(updated);
});

router.patch('/:id/', (req, res) => {
  const index = store.statuses.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.statuses[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };

  store.statuses[index] = updated;
  res.json(updated);
});

router.delete('/:id/', (req, res) => {
  const index = store.statuses.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  store.statuses.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
