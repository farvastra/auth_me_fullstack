const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

router.get('/hello/world', function (req, res) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});

// router.get("/api/csrf/restore", (req, res) => {
//     const csrfToken = req.csrfToken();
//     res.cookie("XSRF-TOKEN", csrfToken);
//     res.status(200).json({
//         'XSRF-Token': csrfToken
//     });
// });

// Restore CSRF token route
router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
      httpOnly: false,  
      secure: true,  
      sameSite: "None", 
    });
    res.json({ "XSRF-Token": req.csrfToken() });
  });

router.use('/api', apiRouter);

module.exports = router;