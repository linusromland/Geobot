// External Dependencies
const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Internal Dependencies
const { executeCommand, commands } = require('./commands');
const { connectToMongo } = require('./connections/mongo');

// Variables
const TOKEN = process.env.TOKEN;

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
	try {
		//Connect to MongoDB
		await connectToMongo();

		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationCommands('886932725049745519'), {
			body: commands.map((command) => ({
				name: command.name,
				description: command.description
			}))
		});

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}

	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isChatInputCommand() && !interaction.isSelectMenu() && !interaction.isButton()) return;

		await executeCommand(interaction);
	});

	client.login(TOKEN);
})();
