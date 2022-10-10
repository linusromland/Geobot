// External Dependencies
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);

// Internal Dependencies
const { recurringChallengeModel } = require('../models');
const { createMatch, getRandomMap, getMapInformation } = require('../geoguessr');
const getChallengeBlock = require('../utils/getChallengeBlock');

async function scheduleDaily(client) {
	const day = dayjs.tz(dayjs(), 'Europe/Stockholm').format('dddd').toLowerCase();
	const hour = dayjs.tz(dayjs(), 'Europe/Stockholm').format('HH:00');
	const recurringChallenges = await recurringChallengeModel.find({
		$or: [{ recurringFrequency: 'daily' }, { recurringFrequency: 'weekly', recurringDay: day }],
		recurringHour: hour
	});
	recurringChallenges.forEach((challenge) => sendChallenge(challenge, client));
}

async function sendChallenge(challenge, client) {
	const mapId = challenge.mapId == 'random' ? (await getRandomMap()).slug : challenge.mapId;

	const match = await createMatch(
		mapId,
		challenge.timeLimit,
		challenge.forbidMoving,
		challenge.forbidRotating,
		challenge.forbidZooming
	);

	const map = await getMapInformation(mapId);
	const challengeBlockEmbed = getChallengeBlock(
		map,
		challenge.timeLimit,
		match.data.token,
		false,
		`New ${challenge.recurringFrequency} challenge!`
	);
	const channel = client.channels.cache.get(challenge.discordChannelId);
	channel.send({ embeds: [challengeBlockEmbed] });
}

module.exports = scheduleDaily;
