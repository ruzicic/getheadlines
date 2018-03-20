const ajv = require('ajv');
const provider = require('./provider');

const compiler = ajv();
const validateProvider = compiler.compile(provider);

module.exports = { validateProvider };
