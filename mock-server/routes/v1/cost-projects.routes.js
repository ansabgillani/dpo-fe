const express = require('express');

const { paginate, nextId, now } = require('./_helpers');
const { store } = require('./_store');

const router = express.Router();

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

router.get('/', (req, res) => {
  const {
    category,
    classification,
    customer,
    fiscal_year,
    period_index_min,
    period_index_max,
    project_title,
    psp_description,
    psp_element,
    stand_reporting_period,
    status
  } = req.query;

  const list = store.costProjects.filter((entry) => {
    if (category && entry.category !== category) return false;
    if (classification && entry.classification !== classification) return false;
    if (customer && entry.customer !== customer) return false;
    if (fiscal_year && entry.fiscal_year !== fiscal_year) return false;
    if (project_title && !String(entry.project_title || '').toLowerCase().includes(String(project_title).toLowerCase())) return false;
    if (psp_description && !String(entry.psp_description || '').toLowerCase().includes(String(psp_description).toLowerCase())) return false;
    if (psp_element && !String(entry.psp_element || '').toLowerCase().includes(String(psp_element).toLowerCase())) return false;
    if (stand_reporting_period && entry.stand_reporting_period !== stand_reporting_period) return false;
    if (status && entry.status !== status) return false;

    const min = toNumber(period_index_min);
    const max = toNumber(period_index_max);
    const idx = toNumber(entry.period_index);
    if (min !== null && idx !== null && idx < min) return false;
    if (max !== null && idx !== null && idx > max) return false;

    return true;
  });

  res.json(paginate(list, req));
});

router.post('/', (req, res) => {
  const { fiscal_year, psp_element } = req.body || {};
  if (!fiscal_year || !psp_element) {
    return res.status(400).json({ error: 'fiscal_year and psp_element are required' });
  }

  const entry = {
    id: nextId(store.costProjects),
    fiscal_year,
    psp_element,
    psp_description: req.body.psp_description || null,
    stand_reporting_period: req.body.stand_reporting_period || null,
    period_index: req.body.period_index ?? null,
    bs_rnd_dcc: req.body.bs_rnd_dcc || null,
    project_ram_status: req.body.project_ram_status || null,
    classification: req.body.classification || null,
    category: req.body.category || null,
    status: req.body.status || null,
    project_title: req.body.project_title || null,
    customer: req.body.customer || null,
    created: now(),
    last_modified: now()
  };

  store.costProjects.push(entry);
  res.status(201).json(entry);
});

router.get('/:id/', (req, res) => {
  const entry = store.costProjects.find((item) => item.id === Number(req.params.id));
  if (!entry) return res.status(404).json({ detail: 'Not found.' });
  res.json(entry);
});

router.put('/:id/', (req, res) => {
  const index = store.costProjects.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.costProjects[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    created: existing.created,
    last_modified: now()
  };

  store.costProjects[index] = updated;
  res.json(updated);
});

router.patch('/:id/', (req, res) => {
  const index = store.costProjects.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.costProjects[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    created: existing.created,
    last_modified: now()
  };

  store.costProjects[index] = updated;
  res.json(updated);
});

router.delete('/:id/', (req, res) => {
  const index = store.costProjects.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  store.costProjects.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
