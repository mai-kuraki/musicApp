let express = require('express');
let router = express.Router();
let service = require('./service');

router.get('/search', (req, res, next) => {
    service.search(req, res);
});

module.exports = router;