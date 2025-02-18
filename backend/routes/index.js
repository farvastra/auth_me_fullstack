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

router.post("/api/run-migrations", async (req, res) => {
  try {
    exec("npx sequelize-cli db:migrate --env production && npx sequelize-cli db:seed:all --env production", (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: "Migrations and seeders ran successfully", output: stdout });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to run migrations", details: error.message });
  }
});

module.exports = router;