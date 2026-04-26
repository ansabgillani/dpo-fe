const express = require('express');

const { paginate } = require('./_helpers');
const { store } = require('./_store');

const router = express.Router();

function sanitize(user) {
  const { password, ...safe } = user;
  return safe;
}

router.get('/', (req, res) => {
  res.json(paginate(store.users.map(sanitize), req));
});

router.get('/me/', (req, res) => {
  if (!req.mockUser) {
    return res.status(401).json({ detail: 'Authentication credentials were not provided.' });
  }
  res.json(sanitize(req.mockUser));
});

router.get('/:id/', (req, res) => {
  const user = store.users.find((entry) => entry.id === Number(req.params.id));
  if (!user) return res.status(404).json({ detail: 'Not found.' });
  res.json(sanitize(user));
});

module.exports = router;
