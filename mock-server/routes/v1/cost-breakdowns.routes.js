const express = require('express');

const { paginate, nextId, now } = require('./_helpers');
const { store } = require('./_store');

const router = express.Router();

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function findCostProject(id) {
  return store.costProjects.find((entry) => entry.id === Number(id));
}

function withCostProjectFields(entry) {
  const costProject = findCostProject(entry.psp_project);
  return {
    ...entry,
    psp_project_element: costProject?.psp_element || entry.psp_project_element || '',
    psp_project_title: costProject?.project_title || entry.psp_project_title || ''
  };
}

router.get('/', (req, res) => {
  const {
    psp_project,
    psp_element,
    reporting_month,
    reporting_month_contains,
    type,
    gross_min,
    gross_max,
    net_min,
    net_max
  } = req.query;

  const list = store.costBreakdowns.filter((entry) => {
    const withProject = withCostProjectFields(entry);

    if (psp_project && withProject.psp_project !== Number(psp_project)) return false;
    if (psp_element && withProject.psp_project_element !== psp_element) return false;
    if (reporting_month && withProject.reporting_month !== reporting_month) return false;
    if (
      reporting_month_contains &&
      !String(withProject.reporting_month || '').toLowerCase().includes(String(reporting_month_contains).toLowerCase())
    ) {
      return false;
    }
    if (type && withProject.type !== type) return false;

    const gross = toNumber(withProject.gross);
    const net = toNumber(withProject.net);
    const grossMin = toNumber(gross_min);
    const grossMax = toNumber(gross_max);
    const netMin = toNumber(net_min);
    const netMax = toNumber(net_max);
    if (grossMin !== null && gross !== null && gross < grossMin) return false;
    if (grossMax !== null && gross !== null && gross > grossMax) return false;
    if (netMin !== null && net !== null && net < netMin) return false;
    if (netMax !== null && net !== null && net > netMax) return false;

    return true;
  });

  res.json(paginate(list.map(withCostProjectFields), req));
});

router.post('/', (req, res) => {
  const { psp_project } = req.body || {};
  if (!psp_project) return res.status(400).json({ error: 'psp_project is required' });

  const entry = {
    id: nextId(store.costBreakdowns),
    psp_project: Number(psp_project),
    type: req.body.type || null,
    reporting_month: req.body.reporting_month || null,
    gross: req.body.gross || null,
    charging_internal: req.body.charging_internal || null,
    charging_to_bl: req.body.charging_to_bl || null,
    net: req.body.net || null,
    adjust_manpower: req.body.adjust_manpower || null,
    ct_costs: req.body.ct_costs || null,
    external_material: req.body.external_material || null,
    external_services: req.body.external_services || null,
    hc_qt_ehs_costs: req.body.hc_qt_ehs_costs || null,
    internal_material: req.body.internal_material || null,
    manpower_old_dcc: req.body.manpower_old_dcc || null,
    me_support: req.body.me_support || null,
    other_support: req.body.other_support || null,
    ps_support: req.body.ps_support || null,
    ssme_support: req.body.ssme_support || null,
    manpower: req.body.manpower || null,
    created: now(),
    last_modified: now()
  };

  store.costBreakdowns.push(entry);
  res.status(201).json(withCostProjectFields(entry));
});

router.get('/:id/', (req, res) => {
  const entry = store.costBreakdowns.find((item) => item.id === Number(req.params.id));
  if (!entry) return res.status(404).json({ detail: 'Not found.' });
  res.json(withCostProjectFields(entry));
});

router.put('/:id/', (req, res) => {
  const index = store.costBreakdowns.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.costBreakdowns[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    psp_project: existing.psp_project,
    created: existing.created,
    last_modified: now()
  };

  store.costBreakdowns[index] = updated;
  res.json(withCostProjectFields(updated));
});

router.patch('/:id/', (req, res) => {
  const index = store.costBreakdowns.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.costBreakdowns[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    psp_project: existing.psp_project,
    created: existing.created,
    last_modified: now()
  };

  store.costBreakdowns[index] = updated;
  res.json(withCostProjectFields(updated));
});

router.delete('/:id/', (req, res) => {
  const index = store.costBreakdowns.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  store.costBreakdowns.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
