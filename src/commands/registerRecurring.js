// External Dependencies
const { SelectMenuBuilder, ButtonBuilder } = require('discord.js');

// Internal Dependencies
const times = require('../data/times.json');
const { userModel } = require('../models');
const defaultMaps = require('../data/defaultMaps.json');

// Variables
const declare = {
	name: 'registerrecurring',
	description: 'Register recurring challenge for server!'
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

	user.recurringCreation = {
		discordServerId: interaction.guild.id,
		discordChannelId: interaction.channel.id
	};
	await user.save();

	const maps = [
		{
			name: 'Random',
			description: 'Chooses a new random map every time',
			mapId: 'random',
			emoji: '🎲'
		},
		...defaultMaps,
		...user.maps
	];

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

	const continueButton = new ButtonBuilder().setCustomId('continue').setLabel('Continue').setStyle(1);

	//send message
	await interaction.reply({
		content: '**Create a recurring challenge!**\nMissing a map? Use `/addMap` to add one!',
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
				components: [continueButton]
			}
		],
		ephemeral: true
	});
}

async function handleSelectChange(interaction) {
	const user = await userModel.findOne({ discordId: interaction.user.id });

	if (interaction.customId == 'mapInput') {
		user.recurringCreation.mapId = interaction.values[0];
	} else if (interaction.customId == 'timeInput') {
		user.recurringCreation.timeLimit = interaction.values[0];
	} else if (interaction.customId == 'gameSettings') {
		user.recurringCreation.gameSettings = interaction.values;
	}

	await user.save();

	//Acknowledge the interaction
	await interaction.deferUpdate();
}

async function handleButtonClick(interaction) {
	if (interaction.customId === 'continue') {
		const timePeriodInput = new SelectMenuBuilder()
			.setCustomId('timePeriodInput')
			.setPlaceholder('Select a time period')
			.addOptions([
				{
					label: 'Daily',
					description: 'Daily challenge',
					value: 'daily',
					emoji: '📅'
				},
				{
					label: 'Weekly',
					description: 'Weekly challenge',
					value: 'weekly',
					emoji: '📆'
				}
			]);

		const hourInput = new SelectMenuBuilder()
			.setCustomId('hourInput')
			.setPlaceholder('Select a hour for challenge to start')
			.addOptions([
				{
					label: '00:00',
					description: '00:00',
					value: '00:00',
					emoji: '🕛'
				},
				{
					label: '01:00',
					description: '01:00',
					value: '01:00',
					emoji: '🕐'
				},
				{
					label: '02:00',
					description: '02:00',
					value: '02:00',
					emoji: '🕑'
				},
				{
					label: '03:00',
					description: '03:00',
					value: '03:00',
					emoji: '🕒'
				},
				{
					label: '04:00',
					description: '04:00',
					value: '04:00',
					emoji: '🕓'
				},
				{
					label: '05:00',
					description: '05:00',
					value: '05:00',
					emoji: '🕔'
				},
				{
					label: '06:00',
					description: '06:00',
					value: '06:00',
					emoji: '🕕'
				},
				{
					label: '07:00',
					description: '07:00',
					value: '07:00',
					emoji: '🕖'
				},
				{
					label: '08:00',
					description: '08:00',
					value: '08:00',
					emoji: '🕗'
				},
				{
					label: '09:00',
					description: '09:00',
					value: '09:00',
					emoji: '🕘'
				},
				{
					label: '10:00',
					description: '10:00',
					value: '10:00',
					emoji: '🕙'
				},
				{
					label: '11:00',
					description: '11:00',
					value: '11:00',
					emoji: '🕚'
				},
				{
					label: '12:00',
					description: '12:00',
					value: '12:00',
					emoji: '🕛'
				},
				{
					label: '13:00',
					description: '13:00',
					value: '13:00',
					emoji: '🕐'
				},
				{
					label: '14:00',
					description: '14:00',
					value: '14:00',
					emoji: '🕑'
				},
				{
					label: '15:00',
					description: '15:00',
					value: '15:00',
					emoji: '🕒'
				},
				{
					label: '16:00',
					description: '16:00',
					value: '16:00',
					emoji: '🕓'
				},
				{
					label: '17:00',
					description: '17:00',
					value: '17:00',
					emoji: '🕔'
				},
				{
					label: '18:00',
					description: '18:00',
					value: '18:00',
					emoji: '🕕'
				},
				{
					label: '19:00',
					description: '19:00',
					value: '19:00',
					emoji: '🕖'
				},
				{
					label: '20:00',
					description: '20:00',
					value: '20:00',
					emoji: '🕗'
				},
				{
					label: '21:00',
					description: '21:00',
					value: '21:00',
					emoji: '🕘'
				},
				{
					label: '22:00',
					description: '22:00',
					value: '22:00',
					emoji: '🕙'
				},
				{
					label: '23:00',
					description: '23:00',
					value: '23:00',
					emoji: '🕚'
				}
			]);

		const weeklyDayInput = new SelectMenuBuilder()
			.setCustomId('weeklyDayInput')
			.setPlaceholder('Select a day (if weekly)')
			.addOptions([
				{
					label: 'Monday',
					description: 'Monday',
					value: 'monday',
					emoji: '🟩'
				},
				{
					label: 'Tuesday',
					description: 'Tuesday',
					value: 'tuesday',
					emoji: '🟩'
				},
				{
					label: 'Wednesday',
					description: 'Wednesday',
					value: 'wednesday',
					emoji: '🟩'
				},
				{
					label: 'Thursday',
					description: 'Thursday',
					value: 'thursday',
					emoji: '🟩'
				},
				{
					label: 'Friday',
					description: 'Friday',
					value: 'friday',
					emoji: '🟩'
				},
				{
					label: 'Saturday',
					description: 'Saturday',
					value: 'saturday',
					emoji: '🟩'
				},
				{
					label: 'Sunday',
					description: 'Sunday',
					value: 'sunday',
					emoji: '🟥'
				}
			]);

		const createButton = new ButtonBuilder().setCustomId('create').setLabel('Create').setStyle(1);

		await interaction.update({
			content:
				'**Create a recurring challenge!**\nMap choosen: Sweden\nTime choosen: 30s\nGame settings: Moving, Zooming, Panning',
			components: [
				{
					type: 1,
					components: [timePeriodInput]
				},
				{
					type: 1,
					components: [hourInput]
				},
				{
					type: 1,
					components: [weeklyDayInput]
				},
				{
					type: 1,
					components: [createButton]
				}
			]
		});
	}
}

module.exports = {
	declare,
	execute
};
