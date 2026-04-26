const express = require('express');

const { paginate, nextId, now } = require('./_helpers');
const { store } = require('./_store');

const router = express.Router();

function toAmount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parsed;
}

function toDecimal(value) {
  return toAmount(value).toFixed(2);
}

function withComputed(entry) {
  const target = toAmount(entry.target);
  const actual = toAmount(entry.actual);
  const variance = actual - target;
  const variancePercentage = target === 0 ? null : ((variance / target) * 100).toFixed(2);

  return {
    ...entry,
    target: toDecimal(entry.target),
    actual: toDecimal(entry.actual),
    variance: variance.toFixed(2),
    variance_percentage: variancePercentage
  };
}

router.get('/', (req, res) => {
  const { product, product__project, calculation_date } = req.query;

  const list = store.productCosts.filter((entry) => {
    if (product && entry.product !== Number(product)) return false;
    if (calculation_date && entry.calculation_date !== calculation_date) return false;

    if (product__project) {
      const productEntry = store.products.find((item) => item.id === entry.product);
      if (!productEntry || productEntry.project !== Number(product__project)) return false;
    }

    return true;
  });

  res.json(paginate(list.map(withComputed), req));
});

router.post('/', (req, res) => {
  const { product, target, actual, calculation_date } = req.body || {};
  if (!product || target === undefined || actual === undefined || !calculation_date) {
    return res.status(400).json({ error: 'product, target, actual and calculation_date are required' });
  }

  const entry = {
    id: nextId(store.productCosts),
    product: Number(product),
    target: toDecimal(target),
    actual: toDecimal(actual),
    calculation_date,
    created: now(),
    last_modified: now()
  };

  store.productCosts.push(entry);
  res.status(201).json(withComputed(entry));
});

router.get('/:id/', (req, res) => {
  const entry = store.productCosts.find((item) => String(item.id) === String(req.params.id));
  if (!entry) return res.status(404).json({ detail: 'Not found.' });
  res.json(withComputed(entry));
});

router.put('/:id/', (req, res) => {
  const index = store.productCosts.findIndex((item) => String(item.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.productCosts[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    product: Number(req.body.product ?? existing.product),
    target: toDecimal(req.body.target ?? existing.target),
    actual: toDecimal(req.body.actual ?? existing.actual),
    created: existing.created,
    last_modified: now()
  };

  store.productCosts[index] = updated;
  res.json(withComputed(updated));
});

router.patch('/:id/', (req, res) => {
  const index = store.productCosts.findIndex((item) => String(item.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.productCosts[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    product: Number(req.body.product ?? existing.product),
    target: toDecimal(req.body.target ?? existing.target),
    actual: toDecimal(req.body.actual ?? existing.actual),
    created: existing.created,
    last_modified: now()
  };

  store.productCosts[index] = updated;
  res.json(withComputed(updated));
});

router.delete('/:id/', (req, res) => {
  const index = store.productCosts.findIndex((item) => String(item.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  store.productCosts.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
