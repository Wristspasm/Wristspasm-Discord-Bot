const env = require("../env.json");
const cfg = require("../config.json");

const fs = require("fs");
const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("src/commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const hypixel = new Hypixel.Client(env.api_key);


client.once("ready", () => {
    console.log(`Client logged in as '${client.user.tag}'`);
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client, hypixel);
	} catch (error) {
		console.error(error);
		const errEmbed = new Discord.MessageEmbed();
        errEmbed.setColor("#ff0000");
        errEmbed.setTitle("Error");
        errEmbed.setDescription(error);
        interaction.reply({ embeds: [errEmbed] });
	}
});

client.login(env.token);
