import { spawn } from 'node:child_process';

const TEST_ENV_FILE = process.env.DPO_ENV_FILE || '.env.test';
const WAIT_TIMEOUT_MS = 120000;
const POLL_MS = 1000;

function run(command, args, env, name) {
  const child = spawn(command, args, {
    env,
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`${name} failed to start: ${error.message}`);
  });

  return child;
}

async function waitForUrl(url) {
  const start = Date.now();

  while (Date.now() - start < WAIT_TIMEOUT_MS) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Continue polling.
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function killSafe(child) {
  if (child && !child.killed) {
    child.kill('SIGTERM');
  }
}

async function main() {
  const env = {
    ...process.env,
    DPO_ENV_FILE: TEST_ENV_FILE
  };

  const mockServer = run('npm', ['run', 'mock:server:test'], env, 'mock server');
  const appServer = run('npm', ['run', 'start:test'], env, 'app server');

  let exitCode = 1;

  const cleanup = () => {
    killSafe(appServer);
    killSafe(mockServer);
  };

  process.on('SIGINT', () => {
    cleanup();
    process.exit(130);
  });

  process.on('SIGTERM', () => {
    cleanup();
    process.exit(143);
  });

  try {
    await waitForUrl('http://localhost:3001/api/health');
    await waitForUrl('http://localhost:4200');

    exitCode = await new Promise((resolve) => {
      const cypress = run('npm', ['run', 'cypress:run:raw'], env, 'cypress');
      cypress.on('exit', (code) => resolve(code ?? 1));
    });
  } finally {
    cleanup();
  }

  process.exit(exitCode);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
