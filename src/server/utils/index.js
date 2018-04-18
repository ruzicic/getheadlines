import { URL } from 'url';
import sanitizeHtml from 'sanitize-html';

/**
 * Get current time as UNIX timestamp
 * @method getCurrentTime
 * @return {Number} Unix Timestamp
 */
const getCurrentTime = () => new Date().getTime();

/**
 * Check if provided string is a valid URL
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
 * Check if provided value is a valid Number
 * @param {*} value
 * @return {Boolean}
 */
const isNumber = value => !Number.isNaN(parseFloat(value));

/**
 * Sanitize HTML
 * https://github.com/punkave/sanitize-html
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

/**
 * Convert number of minutes to crone pattern
 * @param {Number} period Refresh interval in minutes. Default 5.
 * @return {String} crone pattern.
 */
const getCronePattern = (period = 5) => {
	const value = parseFloat(period);

	// second | minute | hour | date | month | day of week
	const map = Object.freeze({
		1: '00 */1 * * * *',
		5: '00 */5 * * * *',
		10: '00 */10 * * * *',
		15: '00 */15 * * * *',
		30: '00 */30 * * * *',
		60: '00 00 */1 * * *',
		120: '00 00 */2 * * *',
		180: '00 00 */3 * * *',
		240: '00 00 */4 * * *',
		300: '00 00 */5 * * *',
		360: '00 00 */6 * * *',
		720: '00 00 */12 * * *',
		1440: '00 00 00 * * *',
	});

	const closest = Object.keys(map).reduce((prev, curr) =>
		(Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));

	return map[closest];
};

export {
	getCurrentTime,
	isValidUrl,
	isNumber,
	cleanHTML,
	getCronePattern,
};
