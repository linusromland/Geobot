const declare = {
	name: 'help',
	description: 'Get help with the bot!'
};

async function execute(interaction) {
	//reply with help
	await interaction.reply({
		content: 'Help is on the way!'
	});
}

module.exports = {
	declare,
	execute
};
