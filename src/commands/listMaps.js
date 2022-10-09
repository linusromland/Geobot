// External Dependencies
const { EmbedBuilder } = require('discord.js');

// Internal Dependencies
const { userModel } = require('../models');
const defaultMaps = require('../data/defaultMaps.json');

const declare = {
	name: 'listmaps',
	description: 'List all your maps!'
};

async function execute(interaction) {
	const user = await userModel.findOne({ discordId: interaction.user.id });

	const maps = [...defaultMaps.map((map) => ({ ...map, default: true })), ...(user?.maps || [])];

	const embed = new EmbedBuilder()
		.setTitle('Your maps')
		.setDescription(
			`Default maps: ${maps.length}\nCustom maps: ${user?.maps?.length || 0}\n**Total maps:** ${
				maps.length
			}\n\n${maps
				.map((map, index) => `${index + 1}. ${map.emoji} ${map.name} ${map.default ? '(default)' : ''}`)
				.join(
					'\n'
				)}\n\nTo create a map, use the \`/addmap\` command.\nTo remove a map, use the \`/removemap\` command.`
		);

	await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
	declare,
	execute
};
