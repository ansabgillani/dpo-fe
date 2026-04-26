const { store } = require('../routes/v1/_store');

/**
 * JWT-like auth middleware for /api/v1 protected routes.
 * Accepts tokens issued by mock auth endpoint: "mock-access-{username}"
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token || !token.startsWith('mock-access-')) {
    return res.status(401).json({ detail: 'Authentication credentials were not provided.' });
  }

  const username = token.slice('mock-access-'.length);
  const user = store.users.find((entry) => entry.username === username);

  if (!user) {
    return res.status(401).json({ detail: 'Token is invalid or expired' });
  }

  req.mockUsername = username;
  req.mockUser = user;
  next();
}

module.exports = authMiddleware;
