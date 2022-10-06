// Internal Dependencies
const api = require('./api');

async function getMapInformation(map) {
	if (!map) return null;

	const request = await api.get(`/maps/${map}`);

	return request.data;
}

module.exports = getMapInformation;
