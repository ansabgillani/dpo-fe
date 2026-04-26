const express = require('express');
const filters = require('../data/filters.json');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    departments: filters.departments,
    businessLines: filters.businessLines,
    types: filters.types
  });
});

router.get('/milestone-sets', (_req, res) => {
  res.json({ milestoneSets: filters.milestoneSets });
});

router.get('/risk-types', (_req, res) => {
  res.json({ riskTypes: filters.riskTypes });
});

module.exports = router;
