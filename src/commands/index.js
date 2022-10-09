// Commands import
const geoguessr = require('./geoguessr');
const random = require('./random');
const help = require('./help');
const addMap = require('./addMap');
const removeMap = require('./removeMap');

const commands = [
	{
		...geoguessr.declare,
		execute: geoguessr.execute
	},
	{
		...random.declare,
		execute: random.execute
	},
	{
		...help.declare,
		execute: help.execute
	},
	{
		...addMap.declare,
		execute: addMap.execute
	},
	{
		...removeMap.declare,
		execute: removeMap.execute
	}
];

async function executeCommand(interaction) {
	const command = commands.find(
		(command) =>
			command.name ===
			(interaction.commandName ??
				(interaction.message && interaction.message.interaction.commandName) ??
				interaction.customId)
	);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
}

module.exports = {
	commands,
	executeCommand
};
