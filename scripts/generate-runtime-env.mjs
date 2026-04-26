import fs from 'node:fs';
import path from 'node:path';

function parseEnv(content) {
  const entries = {};
  const lines = String(content || '').split(/\r?\n/);

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

function buildRuntimeEnvScript(values) {
  const serialized = JSON.stringify(values, null, 2);
  return `window.__DPO_ENV__ = Object.assign({}, window.__DPO_ENV__ || {}, ${serialized});\n`;
}

const envFile = process.env.DPO_ENV_FILE || process.argv[2] || '.env';
const envPath = path.resolve(process.cwd(), envFile);
const targetPath = path.resolve(process.cwd(), 'public/env.js');

if (!fs.existsSync(envPath)) {
  throw new Error(`Environment file not found: ${envPath}`);
}

const parsed = parseEnv(fs.readFileSync(envPath, 'utf8'));
const script = buildRuntimeEnvScript(parsed);

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, script, 'utf8');
