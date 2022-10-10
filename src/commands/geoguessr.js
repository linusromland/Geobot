// External Dependencies
const { SelectMenuBuilder, ButtonBuilder } = require('discord.js');

// Internal Dependencies
const { createMatch, getMapInformation } = require('../geoguessr');
const getChallengeBlock = require('../utils/getChallengeBlock');
const times = require('../data/times.json');
const defaultMaps = require('../data/defaultMaps.json');
const { userModel } = require('../models');

// Variables
const declare = {
	name: 'geoguessr',
	description: 'Create a Geoguessr match!'
};

async function execute(interaction) {
	if (interaction.isSelectMenu()) {
		console.log(`Received select change interaction from ${interaction.user.tag} for ${declare.name}`);
		return await handleSelectChange(interaction);
	} else if (interaction.isButton()) {
		console.log(`Received button click interaction from ${interaction.user.tag} for ${declare.name}`);
		return await handleButtonClick(interaction);
	}

	let user = await userModel.findOne({ discordId: interaction.user.id });
	if (!user) {
		user = await userModel.create({
			discordId: interaction.user.id
		});
	}

	user.mapCreation = {
		noMoving: false,
		noRotating: false,
		noZooming: false
	};
	user.save();

	const maps = [...defaultMaps, ...user.maps];

	const mapInput = new SelectMenuBuilder()
		.setCustomId('mapInput')
		.setPlaceholder('Select a map')
		.addOptions(
			maps.map((map) => ({
				label: map.name,
				description: map.description.length > 100 ? `${map.description.substring(0, 97)}...` : map.description,
				value: map.mapId,
				emoji: map.emoji
			}))
		);

	const timeInput = new SelectMenuBuilder()
		.setCustomId('timeInput')
		.setPlaceholder('Select a time limit')
		.addOptions(times);

	const gameSettings = new SelectMenuBuilder()
		.setCustomId('gameSettings')
		.setPlaceholder('Game settings')
		.setMinValues(0)
		.setMaxValues(3)
		.addOptions([
			{
				label: 'No moving',
				description: 'Forbid moving.',
				value: 'noMoving',
				emoji: '🚫'
			},
			{
				label: 'No rotating',
				description: 'Forbid rotating.',
				value: 'noRotating',
				emoji: '🚫'
			},
			{
				label: 'No zooming',
				description: 'Forbid zooming.',
				value: 'noZooming',
				emoji: '🚫'
			}
		]);

	const createButton = new ButtonBuilder().setCustomId('create').setLabel('Create challenge').setStyle(1);

	//send message
	await interaction.reply({
		content: '**Create a challenge!**\nMissing a map? Use `/addMap` to add one!',
		components: [
			{
				type: 1,
				components: [mapInput]
			},
			{
				type: 1,
				components: [timeInput]
			},
			{
				type: 1,
				components: [gameSettings]
			},
			{
				type: 1,
				components: [createButton]
			}
		],
		ephemeral: true
	});
}

async function handleSelectChange(interaction) {
	const action = interaction.customId;

	const user = await userModel.findOne({ discordId: interaction.user.id });

	if (!user) return;

	const values = interaction.values;

	switch (action) {
		case 'mapInput':
			user.mapCreation = {
				...user.mapCreation,
				mapId: values[0]
			};
			break;
		case 'timeInput':
			user.mapCreation = {
				...user.mapCreation,
				time: values[0]
			};
			break;
		case 'gameSettings':
			user.mapCreation = {
				...user.mapCreation,
				noMoving: values.includes('noMoving'),
				noRotating: values.includes('noRotating'),
				noZooming: values.includes('noZooming')
			};
			break;

		default:
			break;
	}
	user.save();

	//Acknowledge the interaction
	await interaction.deferUpdate();
}

async function handleButtonClick(interaction) {
	const user = await userModel.findOne({ discordId: interaction.user.id });

	if (!user) return;

	if (!user.mapCreation || !user.mapCreation.mapId || !user.mapCreation.time) return await interaction.deferUpdate();

	const map = await getMapInformation(user.mapCreation.mapId);

	if (!map) {
		await interaction.update({ content: 'Invalid map!', ephemeral: true, components: [] });
		return;
	}

	const match = await createMatch(
		user.mapCreation.mapId,
		user.mapCreation.time,
		user.mapCreation.noMoving,
		user.mapCreation.noRotating,
		user.mapCreation.noZooming
	);

	if (!match) {
		await interaction.update({
			content: 'Something went wrong!',
			ephemeral: true,
			components: []
		});
		return;
	}

	const time = user.mapCreation.time;

	user.mapCreation = null;
	user.save();

	//Send message to channel to all users without interaction
	const challengeBlockEmbed = getChallengeBlock(map, time, match.data.token, interaction.user.id);

	//remove the interaction message
	await interaction.update({
		content: 'Challenge created!',
		components: []
	});

	//send the challenge block
	await interaction.channel.send({ embeds: [challengeBlockEmbed] });
}

module.exports = {
	declare,
	execute
};
