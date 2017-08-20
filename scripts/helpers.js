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
	if (!data) {
		logger.error(`Data not provided to sanitize-html.`);
		process.exit(1);
	}

	const config = {
		allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
			'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br',
			'pre'],
		allowedAttributes: {
			a: ['href', 'name', 'target'],
			img: ['src', 'alt']
		},
		selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
		allowedSchemes: ['http', 'https', 'mailto'],
		allowProtocolRelative: true
	}

	return sanitizeHtml(data, config);
}

module.exports = {
	addMinutesToDate,
	cleanHTML
};
