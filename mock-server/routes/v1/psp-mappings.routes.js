const express = require('express');

const { paginate, nextId, now } = require('./_helpers');
const { store, projectSummary } = require('./_store');

const router = express.Router();

function withProjectFields(entry) {
  const summary = projectSummary(entry.project);
  return {
    ...entry,
    project_title: summary.title,
    project_type: summary.type
  };
}

router.get('/', (req, res) => {
  const { project, psp_element, psp_element_exact, project_type } = req.query;

  const list = store.pspMappings.filter((entry) => {
    if (project && entry.project !== Number(project)) return false;
    if (psp_element && !entry.psp_element.toLowerCase().includes(String(psp_element).toLowerCase())) return false;
    if (psp_element_exact && entry.psp_element !== psp_element_exact) return false;
    if (project_type) {
      const summary = projectSummary(entry.project);
      if (summary.type !== project_type) return false;
    }
    return true;
  });

  res.json(paginate(list.map(withProjectFields), req));
});

router.post('/', (req, res) => {
  const { project, psp_element } = req.body || {};
  if (!project || !psp_element) return res.status(400).json({ error: 'project and psp_element are required' });

  const entry = {
    id: nextId(store.pspMappings),
    project: Number(project),
    psp_element,
    created: now(),
    last_modified: now()
  };

  store.pspMappings.push(entry);
  res.status(201).json(withProjectFields(entry));
});

router.get('/:id/', (req, res) => {
  const entry = store.pspMappings.find((item) => item.id === Number(req.params.id));
  if (!entry) return res.status(404).json({ detail: 'Not found.' });
  res.json(withProjectFields(entry));
});

router.put('/:id/', (req, res) => {
  const index = store.pspMappings.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.pspMappings[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };

  store.pspMappings[index] = updated;
  res.json(withProjectFields(updated));
});

router.patch('/:id/', (req, res) => {
  const index = store.pspMappings.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.pspMappings[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };

  store.pspMappings[index] = updated;
  res.json(withProjectFields(updated));
});

router.delete('/:id/', (req, res) => {
  const index = store.pspMappings.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  store.pspMappings.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
