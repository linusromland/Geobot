// Internal Dependencies
const api = require('./api');

async function login() {
	const request = await api.post('/v3/accounts/signin', {
		email: process.env.GEOGUESSR_EMAIL,
		password: process.env.GEOGUESSR_PASSWORD
	});

	if (request.status !== 200) {
		console.log(request.data);
		throw new Error('Failed to login');
	}

	console.log('Logged in successfully');

	return api;
}

module.exports = login;
