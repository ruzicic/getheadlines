const express = require('express');
const sourceProvider = require('../components/source');

const router = new express.Router();

router.use('/sources', sourceProvider);

module.exports = router;
