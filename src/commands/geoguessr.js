// External Dependencies
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

// Internal Dependencies
const maps = require('../data/maps.json');

// Variables
const declare = {
	name: 'geoguessr',
	description: 'Create a Geoguessr match!'
};

async function execute(interaction) {
	console.log(`Received ${interaction.isModalSubmit() ? 'Modal Submission' : 'Command'} interaction from ${interaction.user.tag} for ${declare.name}`);
	if (interaction.isModalSubmit()) return await handleModalSubmission(interaction);

	//Create and reply with a modal to choose map and time
	const modal = new ModalBuilder().setCustomId(declare.name).setTitle('Create new Geoguessr challenge!');

	// Create the select menu components
	const mapInput = new TextInputBuilder().setCustomId('mapInput').setLabel('Map (id or name)').setStyle(TextInputStyle.Short).setValue('world').setMinLength(1).setMaxLength(100).setPlaceholder('Choose a map');

	// Create the text input components
	const timeInput = new TextInputBuilder().setCustomId('timeInput').setLabel('Time (in seconds)').setStyle(TextInputStyle.Short).setValue('60').setMaxLength(3).setMinLength(1).setPlaceholder('Choose a time');

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

	console.log(`New challenge created with map ${mapInput} and time ${timeInput}`);

	await interaction.reply({
		content: 'Challenge created!',
		ephemeral: true
	});

	//Send message to channel to all users
	await interaction.channel.send({
		content: `@everyone New challenge created with map ${mapInput} and time ${timeInput}`
	});
}

module.exports = {
	declare,
	execute
};
