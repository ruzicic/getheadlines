import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import logger from '../src/utils/logger';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
let config = require(`${__dirname}/../config/database/config.json`)[env];
const db = {};
let sequelize;

// Use custom logger in development
config = Object.assign(config, {
	logging: (msg) => {
		if (process.env.NODE_ENV === 'development') {
			logger.debug(`[Database] ${msg}`);
		}
	},
});

if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
	.readdirSync(__dirname)
	.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach((file) => {
		// eslint-disable-next-line dot-notation
		const model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
