// Commands import
const geoguessr = require('./geoguessr');
const help = require('./help');

const commands = [
	{
		...geoguessr.declare,
		execute: geoguessr.execute
	},
	{
		...help.declare,
		execute: help.execute
	}
];

async function executeCommand(interaction) {
	const command = commands.find((command) => command.name === (interaction.commandName ?? interaction.customId));

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

module.exports = {
	commands,
	executeCommand
};
