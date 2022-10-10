// Commands import
const addMap = require('./addMap');
const geoguessr = require('./geoguessr');
const help = require('./help');
const listmaps = require('./listMaps');
const random = require('./random');
const registerRecurring = require('./registerRecurring');
const removeMap = require('./removeMap');
const removeRecurring = require('./removeRecurring');

const commands = [
	{
		...addMap.declare,
		execute: addMap.execute
	},
	{
		...geoguessr.declare,
		execute: geoguessr.execute
	},
	{
		...help.declare,
		execute: help.execute
	},
	{
		...listmaps.declare,
		execute: listmaps.execute
	},
	{
		...random.declare,
		execute: random.execute
	},
	{
		...registerRecurring.declare,
		execute: registerRecurring.execute
	},
	{
		...removeMap.declare,
		execute: removeMap.execute
	},
	{
		...removeRecurring.declare,
		execute: removeRecurring.execute
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
		if (command.includeCommands) await command.execute(interaction, commands);
		else await command.execute(interaction);
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
