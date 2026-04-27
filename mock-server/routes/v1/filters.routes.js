const express = require('express');

const { store } = require('./_store');

const router = express.Router();

router.get('/projects', (_req, res) => {
  const department = Array.from(new Set(store.projects.map((project) => project.department).filter(Boolean))).sort();
  const businessLine = Array.from(new Set(store.projects.map((project) => project.business_line).filter(Boolean))).sort();
  const type = Array.from(new Set(store.projects.map((project) => project.type).filter(Boolean))).sort();

  res.json({
    department,
    business_line: businessLine,
    type
  });
});

module.exports = router;
