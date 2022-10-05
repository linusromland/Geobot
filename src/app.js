// External Dependencies
const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Internal Dependencies
const { executeCommand, commands } = require('./commands');

// Variables
const TOKEN = 'ODg2OTMyNzI1MDQ5NzQ1NTE5.G8whsP.LQZYoeCAYaGv7cJDNpmmJaHUtLlPoVhySF__qU';

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
	try {
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
})();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
	console.log(`Received interaction ${interaction.id} from ${interaction.user.tag} with command ${interaction.commandName}`);
	if (!interaction.isChatInputCommand() && !interaction.isModalSubmit()) return;

	await executeCommand(interaction);
});

client.login(TOKEN);
