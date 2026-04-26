const seedProjects = require('../../data/v1/projects.json');
const seedStatuses = require('../../data/v1/statuses.json');
const seedMilestones = require('../../data/v1/milestones.json');
const seedRisks = require('../../data/v1/risks.json');
const seedPspMappings = require('../../data/v1/psp-mappings.json');
const seedCostProjects = require('../../data/v1/cost-projects.json');
const seedCostBreakdowns = require('../../data/v1/cost-breakdowns.json');
const seedProducts = require('../../data/v1/products.json');
const seedProductCosts = require('../../data/v1/product-costs.json');
const seedUsers = require('../../data/v1/users.json');
const legacyProjects = require('../../data/projects.json');

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function inferContentType(fileName) {
  const lower = String(fileName || '').toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.csv')) return 'text/csv';
  if (lower.endsWith('.txt')) return 'text/plain';
  return 'application/octet-stream';
}

function normalizeFileEntry(entry, projectId) {
  const id = Number(entry.id);
  const safeId = Number.isFinite(id) ? id : 0;
  const name = String(entry.name || entry.title || 'File');

  return {
    id: safeId,
    name,
    sizeBytes: Number(entry.sizeBytes) || 0,
    contentType: String(entry.contentType || inferContentType(name)),
    uploadedAt: String(entry.uploadedAt || new Date().toISOString()),
    downloadUrl: String(entry.downloadUrl || `/api/v1/projects/${projectId}/files/${safeId}/download`)
  };
}

const filesByProject = {};
for (const project of legacyProjects) {
  const projectId = Number(project.id);
  if (!Number.isFinite(projectId)) {
    continue;
  }
  filesByProject[projectId] = Array.isArray(project.files)
    ? project.files.map((entry) => normalizeFileEntry(entry, projectId))
    : [];
}

const store = {
  projects: clone(seedProjects),
  statuses: clone(seedStatuses),
  milestones: clone(seedMilestones),
  risks: clone(seedRisks),
  pspMappings: clone(seedPspMappings),
  costProjects: clone(seedCostProjects),
  costBreakdowns: clone(seedCostBreakdowns),
  products: clone(seedProducts),
  productCosts: clone(seedProductCosts),
  users: clone(seedUsers),
  filesByProject
};

function getProjectById(projectId) {
  return store.projects.find((project) => project.id === Number(projectId));
}

function getFilesForProject(projectId) {
  const key = Number(projectId);
  if (!store.filesByProject[key]) {
    store.filesByProject[key] = [];
  }
  return store.filesByProject[key];
}

function projectSummary(projectId) {
  const project = getProjectById(projectId);
  if (!project) {
    return { title: '', type: '' };
  }
  return { title: project.title || '', type: project.type || '' };
}

module.exports = {
  store,
  getProjectById,
  getFilesForProject,
  projectSummary
};
