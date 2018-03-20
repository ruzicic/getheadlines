module.exports = {
	title: 'Provider Schema',
	type: 'object',
	properties: {
		name: {
			type: ['string'],
		},
		active: {
			type: ['boolean'],
		},
		url: {
			type: ['string'],
		},
		language: {
			type: ['string'],
			enum: ['english', 'serbian'],
		},
	},
	required: [
		'name',
		'active',
		'url',
		'language',
	],
};
