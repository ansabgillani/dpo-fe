const express = require('express');
const multer = require('multer');

const { paginate, nextId, now } = require('./_helpers');
const { store, getProjectById, getFilesForProject } = require('./_store');

const router = express.Router();
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  }
});

const STATUS_NAMES = ['Quality', 'Budget', 'TargetCost', 'Resources', 'Timeline', 'CustomerSatisfaction'];

function toBool(value) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

function createDefaultStatuses(projectId) {
  const base = store.statuses.length > 0 ? Math.max(...store.statuses.map((entry) => entry.id)) : 0;
  STATUS_NAMES.forEach((name, index) => {
    store.statuses.push({
      id: base + index + 1,
      project: projectId,
      name,
      value: 'Gray',
      description: '',
      created: now(),
      last_modified: now()
    });
  });
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getPreviousStatus(currentValue) {
  switch (currentValue) {
    case 'Green':
      return 'Yellow';
    case 'Yellow':
      return 'Red';
    case 'Red':
      return 'Red';
    default:
      return null;
  }
}

router.get('/', (req, res) => {
  const { business_line, department, type, market } = req.query;
  const globalProject = toBool(req.query.global_project);

  const list = store.projects.filter((project) => {
    if (business_line && project.business_line !== business_line) return false;
    if (department && project.department !== department) return false;
    if (type && project.type !== type) return false;
    if (market && project.market !== market) return false;
    if (globalProject !== undefined && Boolean(project.global_project) !== globalProject) return false;
    return true;
  });

  res.json(paginate(list, req));
});

router.post('/', (req, res) => {
  const { title, type, business_line, department, start_date, end_date, market, global_project, display_image } = req.body || {};

  if (!title || !type || !business_line || !department || !start_date || !end_date) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: title, type, business_line, department, start_date, end_date' });
  }

  const id = nextId(store.projects);
  const entry = {
    id,
    title,
    type,
    business_line,
    department,
    market: market || 'Global',
    global_project: Boolean(global_project),
    start_date,
    end_date,
    display_image: display_image || null,
    created: now(),
    last_modified: now(),
    duration_days: String(Math.max(0, Math.ceil((new Date(end_date) - new Date(start_date)) / 86400000))),
    is_active: 'true'
  };

  store.projects.push(entry);
  createDefaultStatuses(id);

  res.status(201).json(entry);
});

router.get('/:id/', (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) return res.status(404).json({ detail: 'Not found.' });
  res.json(project);
});

router.put('/:id/', (req, res) => {
  const index = store.projects.findIndex((project) => project.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.projects[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    created: existing.created,
    last_modified: now()
  };

  if (updated.start_date && updated.end_date) {
    updated.duration_days = String(
      Math.max(0, Math.ceil((new Date(updated.end_date) - new Date(updated.start_date)) / 86400000))
    );
  }

  store.projects[index] = updated;
  res.json(updated);
});

router.patch('/:id/', (req, res) => {
  const index = store.projects.findIndex((project) => project.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  const existing = store.projects[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    created: existing.created,
    last_modified: now()
  };

  if (updated.start_date && updated.end_date) {
    updated.duration_days = String(
      Math.max(0, Math.ceil((new Date(updated.end_date) - new Date(updated.start_date)) / 86400000))
    );
  }

  store.projects[index] = updated;
  res.json(updated);
});

router.delete('/:id/', (req, res) => {
  const projectId = Number(req.params.id);
  const index = store.projects.findIndex((project) => project.id === projectId);
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  store.projects.splice(index, 1);
  store.statuses = store.statuses.filter((entry) => entry.project !== projectId);
  store.milestones = store.milestones.filter((entry) => entry.project !== projectId);
  store.risks = store.risks.filter((entry) => entry.project !== projectId);
  store.pspMappings = store.pspMappings.filter((entry) => entry.project !== projectId);
  store.products = store.products.filter((entry) => entry.project !== projectId);
  const remainingProductIds = new Set(store.products.map((entry) => entry.id));
  store.productCosts = store.productCosts.filter((entry) => remainingProductIds.has(entry.product));
  delete store.filesByProject[projectId];

  res.status(204).send();
});

router.get('/:id/status-trends', (req, res) => {
  const projectId = Number(req.params.id);
  const project = getProjectById(projectId);
  if (!project) return res.status(404).json({ detail: 'Not found.' });

  const trends = STATUS_NAMES.map((name) => {
    const current = store.statuses.find((status) => status.project === projectId && status.name === name);
    const currentValue = current?.value || 'Gray';
    const previousValue = getPreviousStatus(currentValue);

    return {
      name,
      current: {
        value: currentValue,
        changed_at: current?.last_modified || now(),
        description: current?.description || ''
      },
      previous: previousValue
        ? {
            value: previousValue,
            changed_at: current?.created || now()
          }
        : null
    };
  });

  res.json(trends);
});

router.get('/:id/overview-chart', (req, res) => {
  const projectId = Number(req.params.id);
  const project = getProjectById(projectId);
  if (!project) return res.status(404).json({ detail: 'Not found.' });

  const pspElements = new Set(
    store.pspMappings
      .filter((mapping) => mapping.project === projectId)
      .map((mapping) => mapping.psp_element)
  );

  const scopedCostProjects = store.costProjects.filter((entry) => {
    if (pspElements.size > 0) {
      return pspElements.has(entry.psp_element);
    }
    return String(entry.project_title || '').toLowerCase() === String(project.title || '').toLowerCase();
  });

  const scopedCostProjectIds = new Set(scopedCostProjects.map((entry) => entry.id));
  const scopedBreakdowns = store.costBreakdowns.filter((entry) => scopedCostProjectIds.has(entry.psp_project));

  const byMonth = new Map();
  for (const row of scopedBreakdowns) {
    const key = String(row.reporting_month || '2025-01');
    const current = byMonth.get(key) || { reportingMonth: key, gross: 0, net: 0, manpower: 0 };
    current.gross += toNumber(row.gross);
    current.net += toNumber(row.net);
    current.manpower += toNumber(row.charging_to_bl);
    byMonth.set(key, current);
  }

  const series = Array.from(byMonth.values()).sort((a, b) => a.reportingMonth.localeCompare(b.reportingMonth));

  const totals = series.reduce(
    (acc, entry) => ({
      gross: acc.gross + entry.gross,
      net: acc.net + entry.net,
      manpower: acc.manpower + entry.manpower
    }),
    { gross: 0, net: 0, manpower: 0 }
  );

  res.json({ series, totals });
});

router.get('/:id/files', (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) return res.status(404).json({ detail: 'Not found.' });
  res.json(getFilesForProject(req.params.id));
});

router.post('/:id/files', (req, res) => {
  upload.single('file')(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File exceeds maximum size of 50 MB',
        code: 'FILE_TOO_LARGE',
        maxBytes: MAX_FILE_SIZE_BYTES
      });
    }

    if (error) {
      return res.status(400).json({ error: 'Invalid multipart payload' });
    }

    const project = getProjectById(req.params.id);
    if (!project) return res.status(404).json({ detail: 'Not found.' });

    if (!req.file) {
      return res.status(400).json({ error: 'file is required' });
    }

    const files = getFilesForProject(req.params.id);
    const id = files.length > 0 ? Math.max(...files.map((entry) => Number(entry.id) || 0)) + 1 : 1;

    const entry = {
      id,
      name: req.file.originalname,
      sizeBytes: Number(req.file.size) || 0,
      contentType: req.file.mimetype || 'application/octet-stream',
      uploadedAt: now(),
      downloadUrl: `/api/v1/projects/${project.id}/files/${id}/download`
    };

    files.push(entry);
    return res.status(201).json(entry);
  });
});

router.get('/:id/files/:fileId/download', (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) return res.status(404).json({ detail: 'Not found.' });

  const files = getFilesForProject(req.params.id);
  const file = files.find((entry) => String(entry.id) === String(req.params.fileId));
  if (!file) return res.status(404).json({ detail: 'Not found.' });

  res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
  res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
  res.send(`Mock file content for ${file.name}`);
});

router.delete('/:id/files/:fileId', (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) return res.status(404).json({ detail: 'Not found.' });

  const files = getFilesForProject(req.params.id);
  const index = files.findIndex((entry) => String(entry.id) === String(req.params.fileId));
  if (index === -1) return res.status(404).json({ detail: 'Not found.' });

  files.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
