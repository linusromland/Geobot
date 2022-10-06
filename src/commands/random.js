// Internal Dependencies
const { createMatch, getRandomMap } = require('../geoguessr');
const getChallengeBlock = require('../utils/getChallengeBlock');

// Variables
const declare = {
	name: 'random',
	description: 'Create a Geoguessr match with random map and time!'
};

async function execute(interaction) {
	const map = await getRandomMap();
	const time = randomIntFromInterval(30, 300);

	const match = await createMatch(map.id, time);

	if (!match) {
		await interaction.reply({
			content: 'Something went wrong!',
			ephemeral: true
		});
		return;
	}

	if (match.message == 'NoSuchMap') {
		await interaction.reply({ content: 'Invalid map!', ephemeral: true });
		return;
	}

	await interaction.reply({
		content: 'Challenge created!',
		ephemeral: true
	});

	//Send message to channel to all users
	await interaction.channel.send({
		embeds: [getChallengeBlock(map, time, match.data.token, interaction.user.id)]
	});
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
	declare,
	execute
};
