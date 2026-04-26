import { spawn } from 'node:child_process';

const port = 3011;
const baseUrl = `http://127.0.0.1:${port}`;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const server = spawn('node', ['mock-server/server.js'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: {
    ...process.env,
    MOCK_API_PORT: String(port)
  }
});

server.stdout.on('data', (chunk) => {
  process.stdout.write(String(chunk));
});

server.stderr.on('data', (chunk) => {
  process.stderr.write(String(chunk));
});

const stopServer = () => {
  if (!server.killed) {
    server.kill('SIGTERM');
  }
};

const run = async () => {
  await wait(700);

  const health = await fetch(`${baseUrl}/api/health`);
  if (!health.ok) {
    throw new Error(`Health endpoint failed with ${health.status}`);
  }

  const login = await fetch(`${baseUrl}/api/v1/auth/token/`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  if (!login.ok) {
    throw new Error(`Token endpoint failed with ${login.status}`);
  }

  const { access } = await login.json();

  const projects = await fetch(`${baseUrl}/api/v1/projects/`, {
    headers: { authorization: `Bearer ${access}` }
  });
  if (!projects.ok) {
    throw new Error(`Projects endpoint failed with ${projects.status}`);
  }

  const projectData = await projects.json();
  if (!Array.isArray(projectData.results) || projectData.results.length === 0) {
    throw new Error('Expected paginated seeded projects from mock server');
  }

  const filters = await fetch(`${baseUrl}/api/v1/filters/projects`, {
    headers: { authorization: `Bearer ${access}` }
  });
  if (!filters.ok) {
    throw new Error(`Filters endpoint failed with ${filters.status}`);
  }

  const trends = await fetch(`${baseUrl}/api/v1/projects/1/status-trends`, {
    headers: { authorization: `Bearer ${access}` }
  });
  if (!trends.ok) {
    throw new Error(`Status trends endpoint failed with ${trends.status}`);
  }

  const overviewChart = await fetch(`${baseUrl}/api/v1/projects/1/overview-chart`, {
    headers: { authorization: `Bearer ${access}` }
  });
  if (!overviewChart.ok) {
    throw new Error(`Overview chart endpoint failed with ${overviewChart.status}`);
  }

  const milestoneSets = await fetch(`${baseUrl}/api/v1/filters/milestone-sets`, {
    headers: { authorization: `Bearer ${access}` }
  });
  if (!milestoneSets.ok) {
    throw new Error(`Milestone-sets filter endpoint failed with ${milestoneSets.status}`);
  }
  const milestoneSetsData = await milestoneSets.json();
  if (!Array.isArray(milestoneSetsData) || milestoneSetsData.length === 0) {
    throw new Error('Expected non-empty array from milestone-sets filter endpoint');
  }

  const files = await fetch(`${baseUrl}/api/v1/projects/1/files`, {
    headers: { authorization: `Bearer ${access}` }
  });
  if (!files.ok) {
    throw new Error(`Files endpoint failed with ${files.status}`);
  }
  const filesData = await files.json();
  if (!Array.isArray(filesData)) {
    throw new Error('Expected array from files endpoint');
  }

  console.log('Mock server check passed');
};

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    stopServer();
    await wait(150);
  });
