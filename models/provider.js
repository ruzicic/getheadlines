module.exports = (sequelize, DataTypes) => {
	const Provider = sequelize.define('Provider', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		name: DataTypes.STRING,
		active: DataTypes.BOOLEAN,
		url: DataTypes.STRING,
		language: DataTypes.ENUM('english', 'serbian'),
		category: DataTypes.STRING,
		refreshRate: DataTypes.INTEGER,
	}, {});

	// eslint-disable-next-line no-unused-vars
	Provider.associate = (models) => {
		// associations can be defined here
	};

	return Provider;
};
