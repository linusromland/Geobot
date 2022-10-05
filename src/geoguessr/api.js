// External Dependencies
const axios = require('axios');

const api = axios.create({
	baseURL: 'https://www.geoguessr.com/api',
	headers: {
		'content-type': 'application/json'
	},
	withCredentials: true,
	validateStatus: () => true
});

module.exports = api;
