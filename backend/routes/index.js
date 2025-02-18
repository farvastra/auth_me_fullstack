const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

router.get('/hello/world', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});

router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});

router.get("/api/debug/db", async (req, res) => {
    try {
      const dialect = sequelize.getDialect();
      const dbName = sequelize.config.database || "Unknown DB";
      res.json({ dialect, dbName });
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve DB info", details: error });
    }
  });

router.use('/api', apiRouter);

module.exports = router;