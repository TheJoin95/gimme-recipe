const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

module.exports = router;