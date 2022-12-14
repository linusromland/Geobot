// External Dependencies
const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const schedule = require('node-schedule');

// Internal Dependencies
const { executeCommand, commands } = require('./commands');
const { connectToMongo } = require('./connections/mongo');
const scheduleDaily = require('./utils/scheduleDaily');

// Variables
const { TOKEN, APPLICATION_ID } = process.env;

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
	try {
		//Connect to MongoDB
		await connectToMongo();

		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationCommands(APPLICATION_ID), {
			body: commands.map((command) => ({
				name: command.name,
				description: command.description
			}))
		});

		console.log(`Successfully reloaded application (/) commands.\n${commands.length} commands were loaded.`);
	} catch (error) {
		console.error(error);
	}

	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
		schedule.scheduleJob('0 * * * *', () => scheduleDaily(client));
	});

	client.on('interactionCreate', async (interaction) => {
		if (
			!interaction.isChatInputCommand() &&
			!interaction.isSelectMenu() &&
			!interaction.isButton() &&
			!interaction.isModalSubmit()
		)
			return;

		await executeCommand(interaction);
	});

	client.login(TOKEN);
})();
