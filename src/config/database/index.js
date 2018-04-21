require('dotenv').config();
const fs = require('fs');
const util = require('util');
const path = require('path');
const { Client } = require('pg');

const client = new Client();
const readFile = util.promisify(fs.readFile);

(async () => {
	try {
		await client.connect();

		// Drop tables
		const dropScript = await readFile(path.join(__dirname, 'drop_tables.sql'));
		await client.query(dropScript.toString());
		console.log('Tables dropped.');

		// Create tables
		const createScript = await readFile(path.join(__dirname, 'create_tables.sql'));
		await client.query(createScript.toString());
		console.log('Tables created.');
	} catch (err) {
		console.error(err);
		process.exit(1);
	} finally {
		await client.end();
	}
})();
