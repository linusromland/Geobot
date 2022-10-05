// Internal Dependencies
const login = require('./login');

async function getMapInformation(map) {
	if (!map) return null;
	const authenticated = await login();

	const request = await authenticated.get(`/maps/${map}`);

	return request.data;
}

module.exports = getMapInformation;
