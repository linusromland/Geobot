// Internal Dependencies
const login = require('./login');

async function createMatch(
	map = 'world',
	timeLimit = 0,
	options = {
		forbidMoving: false,
		forbidRotating: false,
		forbidZooming: false
	}
) {
	console.log(`Creating match with map ${map} and time limit ${timeLimit}`);
	const authenticated = await login();

	const request = await authenticated.post('/v3/games', {
		map,
		timeLimit,
		options
	});

	console.log(request);

	return request.data;
}

module.exports = createMatch;
