/**
 * @method addMinutesToDate
 * @param {Date} date - Date object. Default NOW
 * @param {number} add - increment. Number of minutes. Default 60
 * @return {Date} - Incremented date object. Default 60 minutes from now
 */
const addMinutesToDate = (date = new Date(), add = 60) => {
	return new Date(date.getTime() + (add * 60000));
};

module.exports = {
	addMinutesToDate
};
