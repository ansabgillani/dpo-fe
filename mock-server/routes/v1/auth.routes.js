const express = require('express');
const { store } = require('./_store');

const router = express.Router();

router.post('/token/', (req, res) => {
  const { username, password } = req.body || {};
  const user = store.users.find((entry) => entry.username === username && entry.password === password);

  if (!user) {
    return res.status(401).json({ detail: 'No active account found with the given credentials' });
  }

  res.json({
    access: `mock-access-${username}`,
    refresh: `mock-refresh-${username}`
  });
});

router.post('/token/refresh/', (req, res) => {
  const { refresh } = req.body || {};

  if (!refresh || !refresh.startsWith('mock-refresh-')) {
    return res.status(401).json({ detail: 'Token is invalid or expired' });
  }

  const username = refresh.slice('mock-refresh-'.length);
  const user = store.users.find((entry) => entry.username === username);

  if (!user) {
    return res.status(401).json({ detail: 'Token is invalid or expired' });
  }

  res.json({ access: `mock-access-${username}` });
});

router.post('/token/verify/', (req, res) => {
  const { token } = req.body || {};

  if (!token || (!token.startsWith('mock-access-') && !token.startsWith('mock-refresh-'))) {
    return res.status(401).json({ detail: 'Token is invalid or expired' });
  }

  res.status(200).json({});
});

module.exports = router;
