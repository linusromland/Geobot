// Internal Dependencies
const { userModel } = require('../models');

const declare = {
	name: 'cancelcreate',
	description: 'Cancel a map creation!'
};

async function execute(interaction) {
	const user = await userModel.findOne({ discordId: interaction.user.id });

	if (!user || !user.mapCreation) {
		return await interaction.reply({
			content: "You don't have a map in creation!",
			ephemeral: true
		});
	}

	user.mapCreation = null;
	user.save();

	await interaction.reply({
		content: 'Map creation cancelled!',
		ephemeral: true
	});
}

module.exports = {
	declare,
	execute
};
