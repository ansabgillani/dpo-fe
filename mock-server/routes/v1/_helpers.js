function paginate(list, req) {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const pageSize = Math.max(1, Math.min(100, parseInt(req.query.page_size || '10', 10)));
  const start = (page - 1) * pageSize;
  const results = list.slice(start, start + pageSize);
  return {
    count: list.length,
    next: start + pageSize < list.length ? `?page=${page + 1}&page_size=${pageSize}` : null,
    previous: page > 1 ? `?page=${page - 1}&page_size=${pageSize}` : null,
    results
  };
}

function nextId(store) {
  return Math.max(0, ...store.map((item) => Number(item.id) || 0)) + 1;
}

function now() {
  return new Date().toISOString();
}

module.exports = { paginate, nextId, now };
