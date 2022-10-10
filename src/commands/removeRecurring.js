// Internal Dependencies
const { recurringChallengeModel } = require('../models');

const declare = {
	name: 'removerecurring',
	description: 'Remove a recurring challenge'
};

async function execute(interaction) {
	const challenge = await recurringChallengeModel.findOne({ discordServerId: interaction.guild.id });
	if (!challenge) {
		return interaction.reply({ content: 'No recurring challenge found', ephemeral: true });
	}
	await challenge.delete();
	return interaction.reply({ content: 'Recurring challenge removed', ephemeral: true });
}

module.exports = {
	declare,
	execute
};
