const express = require('express');
const cors = require('cors');
const fs = require('node:fs');
const path = require('node:path');

const authMiddleware = require('./middleware/auth.middleware');
const { loadEnv } = require('./load-env');

loadEnv();

const app = express();
const port = Number(process.env.MOCK_API_PORT || 3001);
const logsDir = path.join(__dirname, 'logs');

fs.mkdirSync(logsDir, { recursive: true });

app.use(cors());
app.use(express.json());

// Optional artificial delay for frontend loading-state testing.
app.use((req, res, next) => {
  const delayMs = Number(req.query.delay || 0);
  if (delayMs > 0) {
    setTimeout(next, delayMs);
    return;
  }
  next();
});

app.use('/api', (req, res, next) => {
  if (req.query.simulateError === 'true') {
    res.status(500).json({ error: 'Simulated server error', code: 'MOCK_ERROR' });
    return;
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', require('./routes/v1/auth.routes'));

// Logs are fire-and-forget diagnostics — no auth required.
app.use('/api/v1/logs', require('./routes/v1/logs.routes'));

const protectedV1Router = express.Router();
protectedV1Router.use(authMiddleware);
protectedV1Router.use('/projects', require('./routes/v1/projects.routes'));
protectedV1Router.use('/filters', require('./routes/v1/filters.routes'));
protectedV1Router.use('/statuses', require('./routes/v1/statuses.routes'));
protectedV1Router.use('/milestones', require('./routes/v1/milestones.routes'));
protectedV1Router.use('/risks', require('./routes/v1/risks.routes'));
protectedV1Router.use('/psp-mappings', require('./routes/v1/psp-mappings.routes'));
protectedV1Router.use('/cost-projects', require('./routes/v1/cost-projects.routes'));
protectedV1Router.use('/cost-breakdowns', require('./routes/v1/cost-breakdowns.routes'));
protectedV1Router.use('/products', require('./routes/v1/products.routes'));
protectedV1Router.use('/product-costs', require('./routes/v1/product-costs.routes'));
protectedV1Router.use('/users', require('./routes/v1/users.routes'));

app.use('/api/v1', protectedV1Router);

app.use(/^\/api\/.*/, (_req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.listen(port, () => {
  console.log(`Mock API server running on http://localhost:${port}`);
});
