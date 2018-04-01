import moment from 'moment';
import { URL } from 'url';
import sanitizeHtml from 'sanitize-html';

/**
 * Return Current DateTime in specific format
 *
 * @method getCurrentDatetime
 * @param {String} format - Output format
 * @return {Number} Unix Timestamp
 */
const getCurrentDatetime = (format = 'seconds') => {
	let now;

	switch (format) {
	case 'seconds':
		now = moment().format('X');
		break;

	case 'miliseconds':
		now = moment().format('x');
		break;

	default:
		now = moment().format('X');
		break;
	}

	return now;
};

/**
 * Check if provided string is a valid URL
 *
 * @param {String} string
 * @return {Boolean}
 */
const isValidUrl = (string) => {
	try {
		return Boolean(new URL(string));
	} catch (_) {
		return false;
	}
};

/**
 * Sanitize HTML
 * https://github.com/punkave/sanitize-html
 *
 * @method cleanHtml
 * @param {String} data (Dirty) HTML
 * @returns {String} safe HTML
 */
const cleanHTML = (data) => {
	const config = {
		allowedTags: ['p', 'b', 'strong', 'i', 'img', 'ul', 'ol', 'li', 'br'],
		allowedAttributes: {
			a: ['href', 'target', 'title', 'aria-label'],
			img: ['src', 'alt', 'title'],
		},
		selfClosing: ['img', 'br'],
		allowedSchemes: ['http', 'https', 'mailto'],
		allowProtocolRelative: true,

		// Replace multiple spaces with single
		textFilter: text =>
			text.replace(/\s+/, ' '),
	};

	return sanitizeHtml(data, config);
};

export {
	getCurrentDatetime,
	isValidUrl,
	cleanHTML,
};
