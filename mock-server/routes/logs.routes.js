const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const router = express.Router();
const LOG_FILE = path.join(__dirname, '../logs/frontend.log');

router.post('/', (req, res) => {
  const entry = `${JSON.stringify(req.body)}\n`;

  fs.appendFile(LOG_FILE, entry, (error) => {
    if (error) {
      res.status(500).json({ error: 'Failed to write log' });
      return;
    }

    res.json({ success: true });
  });
});

module.exports = router;
