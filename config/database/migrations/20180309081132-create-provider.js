module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('Providers', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			name: {
				type: Sequelize.STRING,
			},
			active: {
				type: Sequelize.BOOLEAN,
			},
			url: {
				type: Sequelize.STRING,
			},
			language: {
				type: Sequelize.STRING,
			},
			category: {
				type: Sequelize.STRING,
			},
			refreshRate: {
				type: Sequelize.INTEGER,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		}),

	// eslint-disable-next-line no-unused-vars
	down: (queryInterface, Sequelize) =>
		queryInterface.dropTable('Providers'),
};
