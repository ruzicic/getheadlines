const express = require('express');
const Source = require('./source-controller');

const router = new express.Router();

// SOURCE ROUTES
router.get('/', Source.getAll);
router.post('/', Source.add);

module.exports = router;
