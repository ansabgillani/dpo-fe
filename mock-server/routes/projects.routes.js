const express = require('express');
const multer = require('multer');
const seedProjects = require('../data/projects.json');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const projects = JSON.parse(JSON.stringify(seedProjects));

const findProjectById = (id) => projects.find((project) => project.id === Number(id));

router.get('/', (req, res) => {
  const { department, businessLine, type } = req.query;

  const list = projects.filter((project) => {
    const departmentMatch = !department || project.department === department;
    const businessLineMatch = !businessLine || project.businessLine === businessLine;
    const typeMatch = !type || project.type === type;

    return departmentMatch && businessLineMatch && typeMatch;
  });

  res.json(list);
});

router.post('/', (req, res) => {
  const {
    title,
    department,
    businessLine,
    type,
    startDate,
    endDate,
    avatarUrl,
    pspElements
  } = req.body || {};

  if (!title || !department || !businessLine || !type || !startDate || !endDate) {
    res.status(400).json({ error: 'Missing required project fields' });
    return;
  }

  const nextId = Math.max(0, ...projects.map((project) => Number(project.id) || 0)) + 1;
  const normalizedPspElements = Array.isArray(pspElements)
    ? pspElements
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .map((name, index) => ({ id: nextId * 100 + index + 1, name }))
    : [];

  const newProject = {
    id: nextId,
    name: String(title),
    avatarUrl: avatarUrl || '',
    department: String(department),
    businessLine: String(businessLine),
    type: String(type),
    startDate: String(startDate),
    endDate: String(endDate),
    statusProject: 'Planning',
    pspProjects: normalizedPspElements,
    stateCards: [],
    milestones: [],
    cost: {
      projectCost: 0,
      latestReportingPeriod: 'P01',
      project: String(title),
      fy: 'FY25',
      pspProject: normalizedPspElements[0]?.name || '',
      breakdownMode: 'project'
    },
    risks: {
      heatmap: {
        before: { high: 0, medium: 0, low: 0 },
        after: { high: 0, medium: 0, low: 0 }
      },
      entries: []
    },
    files: [],
    overviewChart: {
      datasets: []
    }
  };

  projects.unshift(newProject);
  res.status(201).json(newProject);
});

router.get('/:id', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.json(project);
});

router.put('/:id/metadata', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  Object.assign(project, req.body || {});
  res.json(project);
});

router.post('/:id/psp', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const nextId = Date.now();
  const newEntry = { id: nextId, name: req.body?.name || `PSP-${nextId}` };
  project.pspProjects = project.pspProjects || [];
  project.pspProjects.push(newEntry);
  res.status(201).json(newEntry);
});

router.delete('/:id/psp/:pspId', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  project.pspProjects = (project.pspProjects || []).filter(
    (entry) => String(entry.id) !== String(req.params.pspId)
  );

  res.json({ success: true });
});

router.get('/:id/state', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.json(project.stateCards || []);
});

router.get('/:id/overview-chart', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const fallback = {
    datasets: [
      {
        label: 'Budget',
        color: 'rgb(0, 160, 175)',
        data: [32, 18, 27, 45, 42, 36, 100, 88, 79, 63, 81, 120]
      },
      {
        label: 'Actuals+Forecasts',
        color: 'rgb(232, 119, 34)',
        data: [0, 10, 15, 43, 41, 50, 96, 84, 70, 60, 70, 125]
      },
      {
        label: 'Charging Actuals+Forecasts',
        color: 'rgb(0, 112, 192)',
        data: [35, 16, 25, 44, 42, 35, 96, 85, 79, 62, 79, 118]
      }
    ]
  };

  res.json(project.overviewChart || fallback);
});

router.put('/:id/state', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  project.stateCards = Array.isArray(req.body) ? req.body : req.body?.cards || [];
  res.json({ success: true });
});

router.get('/:id/milestones', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const { milestoneSet } = req.query;
  const milestones = (project.milestones || []).filter(
    (item) => !milestoneSet || item.milestoneSet === milestoneSet
  );

  res.json(milestones);
});

router.put('/:id/milestones/:milestoneId', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const milestone = (project.milestones || []).find(
    (item) => String(item.id) === String(req.params.milestoneId)
  );

  if (!milestone) {
    res.status(404).json({ error: 'Milestone not found' });
    return;
  }

  Object.assign(milestone, req.body || {});
  res.json(milestone);
});

router.get('/:id/cost', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.json({
    ...(project.cost || {}),
    filters: {
      project: req.query.project,
      fy: req.query.fy,
      pspProject: req.query.pspProject,
      breakdownMode: req.query.breakdownMode
    }
  });
});

router.put('/:id/cost/breakdown/:productId', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const products = project.cost?.breakdown?.products || [];
  const product = products.find((item) => String(item.id) === String(req.params.productId));

  if (!product) {
    res.status(404).json({ error: 'Breakdown product not found' });
    return;
  }

  Object.assign(product, req.body || {});
  res.json(product);
});

router.get('/:id/risks', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const { riskType } = req.query;
  const entries = (project.risks?.entries || []).filter(
    (risk) => !riskType || risk.riskType === riskType
  );

  res.json({
    heatmap: project.risks?.heatmap || { before: {}, after: {} },
    risks: entries
  });
});

router.post('/:id/risks', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const nextId = Date.now();
  const newRisk = { id: nextId, ...req.body };

  if (!project.risks) {
    project.risks = { heatmap: { before: {}, after: {} }, entries: [] };
  }

  project.risks.entries.push(newRisk);
  res.status(201).json(newRisk);
});

router.put('/:id/risks/:riskId', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const risks = project.risks?.entries || [];
  const risk = risks.find((item) => String(item.id) === String(req.params.riskId));

  if (!risk) {
    res.status(404).json({ error: 'Risk not found' });
    return;
  }

  Object.assign(risk, req.body || {});
  res.json(risk);
});

router.get('/:id/files', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.json(project.files || []);
});

router.post('/:id/files', upload.single('file'), (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const fileName = req.file?.originalname || req.body?.title || 'uploaded-file.txt';
  const file = { id: Date.now(), title: fileName, status: 'Active' };

  project.files = project.files || [];
  project.files.push(file);
  res.status(201).json(file);
});

router.get('/:id/files/:fileId/download', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const file = (project.files || []).find((item) => String(item.id) === String(req.params.fileId));

  if (!file) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  res.setHeader('Content-Disposition', `attachment; filename="${file.title}"`);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(`Mock file content for ${file.title}`);
});

router.delete('/:id/files/:fileId', (req, res) => {
  const project = findProjectById(req.params.id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  project.files = (project.files || []).filter((item) => String(item.id) !== String(req.params.fileId));
  res.json({ success: true });
});

module.exports = router;
