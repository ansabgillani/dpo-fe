const express = require('express');

const { paginate, nextId, now } = require('./_helpers');
const { store, projectSummary } = require('./_store');

const router = express.Router();

function withComputedFields(entry, includeCost = false) {
  const summary = projectSummary(entry.project);
  const result = {
    ...entry,
    project_title: summary.title,
    duration_days: Math.max(0, Math.ceil((new Date(entry.end_date) - new Date(entry.start_date)) / 86400000))
  };

  if (includeCost) {
    const cost = store.productCosts.find((item) => item.product === entry.id);
    result.cost = cost || null;
  }

  return result;
}

router.get('/', (req, res) => {
  const { project, business_line, department, market, name } = req.query;

  const list = store.products.filter((entry) => {
    if (project && entry.project !== Number(project)) return false;
    if (business_line && entry.business_line !== business_line) return false;
    if (department && entry.department !== department) return false;
    if (market && entry.market !== market) return false;
    if (name && !entry.name.toLowerCase().includes(String(name).toLowerCase())) return false;
    return true;
  });

  res.json(paginate(list.map((entry) => withComputedFields(entry)), req));
});

router.post('/', (req, res) => {
  const { project, name, business_line, department, market, start_date, end_date } = req.body || {};
  if (!project || !name || !business_line || !department || !market || !start_date || !end_date) {
    return res
      .status(400)
      .json({ error: 'project, name, business_line, department, market, start_date and end_date are required' });
  }

  const entry = {
    id: nextId(store.products),
    project: Number(project),
    name,
    business_line,
    department,
    market,
    global_product: Boolean(req.body.global_product),
    start_date,
    end_date,
    duration_days: Math.max(0, Math.ceil((new Date(end_date) - new Date(start_date)) / 86400000)),
    display_image: req.body.display_image || null,
    created: now(),
    last_modified: now()
  };

  store.products.push(entry);
  res.status(201).json(withComputedFields(entry));
});

router.get('/:id/', (req, res) => {
  const entry = store.products.find((item) => item.id === Number(req.params.id));
  if (!entry) return res.status(404).json({ detail: 'Not found.' });
  res.json(withComputedFields(entry, true));
});

router.put('/:id/', (req, res) => {
  const index = store.products.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };

  if (updated.start_date && updated.end_date) {
    updated.duration_days = Math.max(
      0,
      Math.ceil((new Date(updated.end_date) - new Date(updated.start_date)) / 86400000)
    );
  }

  store.products[index] = updated;
  res.json(withComputedFields(updated));
});

router.patch('/:id/', (req, res) => {
  const index = store.products.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    project: existing.project,
    created: existing.created,
    last_modified: now()
  };

  if (updated.start_date && updated.end_date) {
    updated.duration_days = Math.max(
      0,
      Math.ceil((new Date(updated.end_date) - new Date(updated.start_date)) / 86400000)
    );
  }

  store.products[index] = updated;
  res.json(withComputedFields(updated));
});

router.delete('/:id/', (req, res) => {
  const productId = Number(req.params.id);
  const index = store.products.findIndex((item) => item.id === productId);
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  store.products.splice(index, 1);
  store.productCosts = store.productCosts.filter((entry) => entry.product !== productId);
  res.status(204).send();
});

module.exports = router;
