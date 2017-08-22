const {logger} = require('./logger');
const sanitizeHtml = require('sanitize-html');

/**
 * @method addMinutesToDate
 * @param {Date} date - Date object. Default NOW
 * @param {number} add - increment. Number of minutes. Default 60
 * @return {Date} - Incremented date object. Default 60 minutes from now
 */
const addMinutesToDate = (date = new Date(), add = 60) => {
	return new Date(date.getTime() + (add * 60000));
};

// Sanitize HTML
const cleanHTML = data => {
	// if (!data) {
	// 	logger.error(`Data not provided to sanitize-html.`);
	// 	process.exit(1);
	// }

	const config = {
		allowedTags: ['p', 'b', 'strong', 'i', 'img', 'ul', 'ol', 'li', 'br'],
		allowedAttributes: {
			a: ['href', 'target'],
			img: ['src', 'alt']
		},
		selfClosing: ['img', 'br'],
		allowedSchemes: ['http', 'https', 'mailto'],
		allowProtocolRelative: true,
		// Replace multiple spaces with single
		textFilter: text => {
			return text.replace(/\s+/, ' ');
		  }
	}

	return sanitizeHtml(data, config);
}

module.exports = {
	addMinutesToDate,
	cleanHTML
};
