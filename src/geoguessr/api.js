// External Dependencies
const axios = require('axios');

const api = axios.create({
	baseURL: 'https://www.geoguessr.com/api',
	headers: {
		'content-type': 'application/json',
		Cookie: `devicetoken=${process.env.GEOGUESSR_DEVICE_TOKEN};_ncfa=${process.env.GEOGUESSR_NCF_TOKEN}`
	},
	withCredentials: true,
	validateStatus: () => true
});

module.exports = api;
