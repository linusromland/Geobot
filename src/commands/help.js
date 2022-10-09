// External Dependencies
const { EmbedBuilder } = require('discord.js');

const declare = {
	name: 'help',
	description: 'Get help with the bot!',
	includeCommands: true
};

async function execute(interaction, commands) {
	const embed = new EmbedBuilder()
		.setTitle('Help')
		.setDescription(commands.map((command) => `**/${command.name}** - ${command.description}`).join('\n'));

	await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
	declare,
	execute
};
