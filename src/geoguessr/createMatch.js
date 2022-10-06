// Internal Dependencies
const api = require('./api');

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

	const request = await api.post('/v3/challenges', {
		map,
		timeLimit,
		...options
	});

	return request;
}

module.exports = createMatch;
