// External Dependencies
const { SelectMenuBuilder, ButtonBuilder } = require('discord.js');

// Internal Dependencies
const { userModel } = require('../models');

const declare = {
	name: 'removemap',
	description: 'Remove a map!'
};

async function execute(interaction) {
	if (interaction.isSelectMenu()) {
		console.log(`Received select change interaction from ${interaction.user.tag} for ${declare.name}`);
		return await handleSelectChange(interaction);
	} else if (interaction.isButton()) {
		console.log(`Received button click interaction from ${interaction.user.tag} for ${declare.name}`);
		return await handleButtonClick(interaction);
	}

	const user = await userModel.findOne({ discordId: interaction.user.id });
	if (!user) return await interaction.reply({ content: 'You have no maps!', ephemeral: true });

	user.removeMap = '';
	await user.save();

	if (!user.maps.length) return await interaction.reply({ content: 'You have no maps!', ephemeral: true });

	const mapInput = new SelectMenuBuilder()
		.setCustomId('mapInput')
		.setPlaceholder('Select a map to remove')
		.addOptions(
			user.maps.map((map) => ({
				label: map.name,
				description: map.description.length > 100 ? `${map.description.substring(0, 97)}...` : map.description,
				value: map.mapId,
				emoji: map.emoji
			}))
		);

	const createButton = new ButtonBuilder().setCustomId('removeMap').setLabel('Remove map').setStyle(1);

	//send message
	await interaction.reply({
		content: 'Select a map to remove!',
		components: [
			{
				type: 1,
				components: [mapInput]
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
	const user = await userModel.findOne({ discordId: interaction.user.id });
	if (!user) return await interaction.reply({ content: 'You have no maps!', ephemeral: true });

	if (interaction.customId == 'mapInput') {
		user.removeMap = interaction.values[0];
		await user.save();
	}

	//Acknowledge the interaction
	await interaction.deferUpdate();
}

async function handleButtonClick(interaction) {
	const user = await userModel.findOne({ discordId: interaction.user.id });
	if (!user) return await interaction.reply({ content: 'You have no maps!', ephemeral: true });

	if (interaction.customId == 'removeMap') {
		if (!user.removeMap) return;

		user.maps = user.maps.filter((map) => map.mapId != user.removeMap);
		user.removeMap = '';
		await user.save();
	}

	//Reply to the interaction
	await interaction.reply({ content: 'Map removed!', ephemeral: true });
}

module.exports = {
	declare,
	execute
};
