const parseString = require('xml2js').parseString;

// source: https://github.com/radiovisual/xml-to-json-promise
// options: https://github.com/Leonidas-from-XIV/node-xml2js#options
const xmlToJson = xmlData => {
	return new Promise((resolve, reject) => {
		parseString(xmlData, (err, result) => {
			if (err) {
				console.error('Failed xmlToJson!!');
				console.error(err);
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

// obj['_']
const prettifyGuid = obj => typeof (obj) === 'string' ? obj : obj._;

const parseFeed = json => {
    // testirati da li je uvijek ovakav objekat
	let items = json.rss.channel['0'].item;
	let parsed = [];

	Object.keys(items).forEach(item => {
		parsed.push({
			title: items[item].title[0],
			pubDate: items[item].pubDate[0],
			link: items[item].link[0],
			guid: prettifyGuid(items[item].guid[0]),
			author: items[item].author,
			description: items[item].description[0],
			content: items[item].content
		});
	});

	return parsed;
};

module.exports = {
	xmlToJson,
	parseFeed
};
