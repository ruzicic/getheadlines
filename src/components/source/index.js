const express = require('express');
const bodyParser = require('body-parser');
const Source = require('./source-controller');

const router = new express.Router();
const jsonParser = bodyParser.json();

// PROVIDER ROUTES
router.get('/', Source.getAll);
router.post('/', jsonParser, Source.add);

module.exports = router;
