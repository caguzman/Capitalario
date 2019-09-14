const express = require('express');
const router = express.Router();

router.get('/countdown', (req, res) => {
    res.render('./countdown');
});

module.exports = router;