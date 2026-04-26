const fs = require('node:fs');
const path = require('node:path');

function parseEnv(text) {
  const entries = {};
  const lines = String(text || '').split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separator = line.indexOf('=');
    if (separator <= 0) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^"|"$/g, '');

    if (!key) {
      continue;
    }

    entries[key] = value;
  }

  return entries;
}

function loadEnv() {
  const envFile = process.env.DPO_ENV_FILE || '.env';
  const envPath = path.resolve(process.cwd(), envFile);

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const parsed = parseEnv(content);

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof process.env[key] === 'undefined') {
      process.env[key] = value;
    }
  }
}

module.exports = {
  loadEnv
};
