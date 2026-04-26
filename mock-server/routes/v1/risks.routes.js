const express = require('express');

const { paginate, nextId, now } = require('./_helpers');
const { store, projectSummary } = require('./_store');

const router = express.Router();

function withProjectTitle(entry) {
  const { title } = projectSummary(entry.project);
  return {
    ...entry,
    project_title: title,
    riskDescription: entry.description || ''
  };
}

router.get('/', (req, res) => {
  const { project, type, state, probability, severity, action_state, title } = req.query;

  const list = store.risks.filter((entry) => {
    if (project && entry.project !== Number(project)) return false;
    if (type && entry.type !== type) return false;
    if (state && entry.state !== state) return false;
    if (probability && entry.probability !== probability) return false;
    if (severity && entry.severity !== severity) return false;
    if (action_state && entry.action_state !== action_state) return false;
    if (title && !entry.title.toLowerCase().includes(String(title).toLowerCase())) return false;
    return true;
  });

  res.json(paginate(list.map(withProjectTitle), req));
});

router.post('/', (req, res) => {
  const { project, title } = req.body || {};
  if (!project || !title) return res.status(400).json({ error: 'project and title are required' });

  const entry = {
    id: nextId(store.risks),
    project: Number(project),
    title,
    type: req.body.type || '',
    state: req.body.state || '',
    probability: req.body.probability || '',
    severity: req.body.severity || '',
    loss_valuation: req.body.loss_valuation || null,
    description: req.body.description || req.body.riskDescription || '',
    action: req.body.action || '',
    action_state: req.body.action_state || '',
    due_date: req.body.due_date || null,
    severity_after_action: req.body.severity_after_action || null,
    probability_after_action: req.body.probability_after_action || null,
    loss_after_action: req.body.loss_after_action || null,
    created: now(),
    last_modified: now()
  };

  store.risks.push(entry);
  res.status(201).json(withProjectTitle(entry));
});

router.get('/:id/', (req, res) => {
  const entry = store.risks.find((item) => item.id === Number(req.params.id));
  if (!entry) return res.status(404).json({ detail: 'Not found.' });
  res.json(withProjectTitle(entry));
});

router.put('/:id/', (req, res) => {
  const index = store.risks.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const nextBody = {
    ...(req.body || {}),
    ...(req.body?.riskDescription && !req.body?.description
      ? { description: req.body.riskDescription }
      : {})
  };

  const existing = store.risks[index];
  const updated = {
    ...existing,
    ...nextBody,
    id: existing.id,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };

  store.risks[index] = updated;
  res.json(withProjectTitle(updated));
});

router.patch('/:id/', (req, res) => {
  const index = store.risks.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const nextBody = {
    ...(req.body || {}),
    ...(req.body?.riskDescription && !req.body?.description
      ? { description: req.body.riskDescription }
      : {})
  };

  const existing = store.risks[index];
  const updated = {
    ...existing,
    ...nextBody,
    id: existing.id,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };

  store.risks[index] = updated;
  res.json(withProjectTitle(updated));
});

router.delete('/:id/', (req, res) => {
  const index = store.risks.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  store.risks.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
