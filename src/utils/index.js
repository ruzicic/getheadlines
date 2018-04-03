import moment from 'moment';
import { URL } from 'url';
import sanitizeHtml from 'sanitize-html';

/**
 * Return DateTime in choosen format
 *
 * @method formatDateTime
 * @param {Date} d Date object. Default new Date().
 * @param {String} f Output format. Default UNIX timestamp in seconds
 * @return {Number} Unix Timestamp
 */
const formatDateTime = (d = new Date(), f = 'seconds') => {
	const now = moment(d);

	switch (f) {
	case 'seconds':
		return now.format('X');

	case 'miliseconds':
		return now.format('x');

	// Example: "Sunday, February 14th 2010, 3:25:50 pm"
	case 'detailed':
		return now.format('dddd, MMMM Do YYYY, h:mm:ss a');

	default:
		return now.format('X');
	}
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

/**
 * Convert number of minutes to crone pattern
 *
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
	formatDateTime,
	isValidUrl,
	cleanHTML,
	getCronePattern,
};
