// External Dependencies
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

// Internal Dependencies
const { getMapInformation } = require('../geoguessr');
const { userModel } = require('../models');
const defaultMaps = require('../data/defaultMaps.json');

const declare = {
	name: 'addmap',
	description: 'Add a map to the database!'
};

async function execute(interaction) {
	if (interaction.isModalSubmit()) return await modalSubmit(interaction);

	const modal = new ModalBuilder().setCustomId(declare.name).setTitle('Add Map');

	const mapInput = new TextInputBuilder()
		.setCustomId('mapInput')
		.setLabel("Map's name (or ID)")
		.setStyle(TextInputStyle.Short)
		.setRequired(true);

	const mapInputActionRow = new ActionRowBuilder().addComponents(mapInput);

	modal.addComponents(mapInputActionRow);

	// Show the modal to the user
	await interaction.showModal(modal);
}

async function modalSubmit(interaction) {
	const map = interaction.fields.getTextInputValue('mapInput');

	const mapInformation = await getMapInformation(map);

	if (!mapInformation) return await interaction.reply({ content: 'Invalid name or ID!', ephemeral: true });

	let user = await userModel.findOne({ discordId: interaction.user.id });
	if (!user) {
		user = await userModel.create({
			discordId: interaction.user.id
		});
	}

	if ([...user.maps, ...defaultMaps].some((map) => map.mapId === mapInformation.slug)) {
		return await interaction.reply({ content: 'You already have this map!', ephemeral: true });
	}

	user.maps.push({
		mapId: mapInformation.slug,
		name: mapInformation.name,
		description: mapInformation.description || 'No description',
		emoji: '🗺️'
	});
	user.save();

	await interaction.reply({
		content: `Added map ${mapInformation.name} to your maps!`,
		ephemeral: true
	});
}

module.exports = {
	declare,
	execute
};
