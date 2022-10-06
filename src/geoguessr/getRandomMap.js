// Internal Dependencies
const api = require('./api');

async function getRandomMap() {
	const request = await api.get(`/v3/social/maps/browse/popular/random`);

	return request.data[0];
}

module.exports = getRandomMap;
