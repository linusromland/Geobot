// External Dependencies
const { SelectMenuBuilder, ButtonBuilder } = require('discord.js');
const pretty = require('pretty-time');

// Internal Dependencies
const times = require('../data/times.json');
const { recurringChallengeModel, userModel } = require('../models');
const defaultMaps = require('../data/defaultMaps.json');
const { getMapInformation } = require('../geoguessr');

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
				value: 'forbidMoving',
				emoji: '🚫'
			},
			{
				label: 'No rotating',
				description: 'Forbid rotating.',
				value: 'forbidRotating',
				emoji: '🚫'
			},
			{
				label: 'No zooming',
				description: 'Forbid zooming.',
				value: 'forbidZooming',
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
		user.recurringCreation = {
			...user.recurringCreation,
			forbidMoving: interaction.values.includes('forbidMoving'),
			forbidRotating: interaction.values.includes('forbidRotating'),
			forbidZooming: interaction.values.includes('forbidZooming')
		};
	} else if (interaction.customId == 'recurringFrequencyInput') {
		user.recurringCreation.recurringFrequency = interaction.values[0];
	} else if (interaction.customId == 'hourInput') {
		user.recurringCreation.hour = interaction.values[0];
	} else if (interaction.customId == 'weeklyDayInput') {
		user.recurringCreation.weeklyDay = interaction.values[0];
	}

	await userModel.updateOne({ discordId: interaction.user.id }, user);

	//Acknowledge the interaction
	await interaction.deferUpdate();
}

async function handleButtonClick(interaction) {
	const user = await userModel.findOne({ id: interaction.user.id });
	const map = await getMapInformation(user.recurringCreation.mapId);

	if (interaction.customId === 'continue') {
		if (!user.recurringCreation.mapId || !user.recurringCreation.timeLimit) return await interaction.deferUpdate();

		const recurringFrequencyInput = new SelectMenuBuilder()
			.setCustomId('recurringFrequencyInput')
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
					emoji: '📅'
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
			content: `**Create a recurring challenge!**\nMap choosen: ${map.name}\nTime choosen: ${pretty(
				[user.recurringCreation.timeLimit, 0],
				's'
			)}\nGame Settings: ${user.recurringCreation.forbidMoving ? 'No moving' : 'Moving'}, ${
				user.recurringCreation.forbidRotating ? 'no rotating' : 'rotating'
			}, ${user.recurringCreation.forbidZooming ? 'no zooming' : 'zooming'}`,
			components: [
				{
					type: 1,
					components: [recurringFrequencyInput]
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
	} else if (interaction.customId === 'create') {
		if (
			!user ||
			!user.recurringCreation ||
			!user.recurringCreation.discordServerId ||
			!user.recurringCreation.discordChannelId ||
			!user.recurringCreation.mapId ||
			!user.recurringCreation.timeLimit ||
			!user.recurringCreation.recurringFrequency ||
			!user.recurringCreation.hour ||
			(user.recurringCreation.recurringFrequency == 'weekly' && !user.recurringCreation.weeklyDay)
		) {
			//Acknowledge the interaction
			return await interaction.deferUpdate();
		}

		await recurringChallengeModel.updateOne(
			{ discordServerId: user.recurringCreation.discordServerId },
			{
				discordChannelId: user.recurringCreation.discordChannelId,
				mapId: user.recurringCreation.mapId,
				timeLimit: user.recurringCreation.timeLimit,
				forbidMoving: user.recurringCreation.forbidMoving || false,
				forbidZooming: user.recurringCreation.forbidZooming || false,
				forbidRotating: user.recurringCreation.forbidRotating || false,
				recurringFrequency: user.recurringCreation.recurringFrequency,
				recurringHour: user.recurringCreation.hour,
				recurringDay: user.recurringCreation.weeklyDay?.toString()
			},
			{ upsert: true }
		);

		await interaction.update({
			content: `**Recurring challenge created!**\nMap choosen: ${map.name}\nTime choosen: ${pretty(
				[user.recurringCreation.timeLimit, 0],
				's'
			)}\nGame Settings: ${user.recurringCreation.forbidMoving ? 'No moving' : 'Moving'}, ${
				user.recurringCreation.forbidRotating ? 'no rotating' : 'rotating'
			}, ${user.recurringCreation.forbidZooming ? 'no zooming' : 'zooming'}\nRecurring frequency: ${
				user.recurringCreation.recurringFrequency == 'daily'
					? 'Daily at ' + user.recurringCreation.hour
					: capitalizeFirstLetter(user.recurringCreation.weeklyDay) + 's at ' + user.recurringCreation.hour
			}`,
			components: []
		});
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	declare,
	execute
};
