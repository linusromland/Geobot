// External Dependencies
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

// Internal Dependencies
const { createMatch, getMapInformation } = require('../geoguessr');

// Variables
const declare = {
	name: 'geoguessr',
	description: 'Create a Geoguessr match!'
};
const challengeURL = 'https://www.geoguessr.com/challenge/';

async function execute(interaction) {
	console.log(
		`Received ${interaction.isModalSubmit() ? 'Modal Submission' : 'Command'} interaction from ${
			interaction.user.tag
		} for ${declare.name}`
	);
	if (interaction.isModalSubmit()) return await handleModalSubmission(interaction);

	//Create and reply with a modal to choose map and time
	const modal = new ModalBuilder().setCustomId(declare.name).setTitle('Create new Geoguessr challenge!');

	// Create the select menu components
	const mapInput = new TextInputBuilder()
		.setCustomId('mapInput')
		.setLabel('Map (id or name)')
		.setStyle(TextInputStyle.Short)
		.setValue('world')
		.setMinLength(1)
		.setMaxLength(100)
		.setPlaceholder('Choose a map');

	// Create the text input components
	const timeInput = new TextInputBuilder()
		.setCustomId('timeInput')
		.setLabel('Time (in seconds)')
		.setStyle(TextInputStyle.Short)
		.setValue('60')
		.setMaxLength(3)
		.setMinLength(1)
		.setPlaceholder('Choose a time');

	const mapAction = new ActionRowBuilder().addComponents(mapInput);
	const timeAction = new ActionRowBuilder().addComponents(timeInput);

	// Add inputs to the modal
	modal.addComponents(mapAction, timeAction);

	await interaction.showModal(modal);
}

async function handleModalSubmission(interaction) {
	if (interaction.customId !== declare.name) return;

	const mapInput = interaction.fields.getTextInputValue('mapInput');
	const timeInput = interaction.fields.getTextInputValue('timeInput');

	//Check if time is a number
	if (isNaN(timeInput)) {
		await interaction.reply({
			content: 'Time must be a number!',
			ephemeral: true
		});
		return;
	}

	const mapInformation = await getMapInformation(mapInput);

	if (!mapInformation) {
		await interaction.reply({ content: 'Invalid map!', ephemeral: true });
		return;
	}

	const match = await createMatch(mapInput, timeInput);

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

	if (!match.data.token) {
		await interaction.reply({
			content: 'Something went wrong!',
			ephemeral: true
		});
		return;
	}

	//Send message to channel to all users
	await interaction.channel.send({
		content: `New challenge created with map ${mapInformation.name} and time ${timeInput}s at ${challengeURL}${match.data.token}`
	});
}

module.exports = {
	declare,
	execute
};
