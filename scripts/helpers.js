const {logger} = require('./logger');
const sanitizeHtml = require('sanitize-html');

 // Increment current date for number of minutes
const addMinutesToDate = (date = new Date(), add = 60) => {
	return new Date(date.getTime() + (add * 60000));
};

// Return date in history (now - offset) in UTC format
const daysAgo = (offset = 3) => {
	let date = new Date();
	let past = new Date().setDate((date.getDate() - offset));
	return new Date(past).toUTCString();
};

// Sanitize HTML - remove unallowed tags
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
	cleanHTML,
	daysAgo
};
