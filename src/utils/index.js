const moment = require('moment');

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


module.exports = {
	getCurrentDatetime,
};
