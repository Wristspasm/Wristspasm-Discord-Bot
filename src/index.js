const env = require("../env.json");
const cfg = require("../config.json");

const fs = require("fs");
const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("src/commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const hypixel = new Hypixel.Client(env.api_key);


client.once("ready", () => {
    console.log(`Client logged in as '${client.user.tag}'`);
	client.user.setActivity("/g join Wristspasm", { type: "PLAYING" });
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

// client.on("message", (message) => {
// 	if (message.member.roles.cache.has(cfg.cursed_role_id)) {
// 		if (message.content.toLowerCase().startsWith("i'm") || message.content.toLowerCase().startsWith("im")) {
// 			let msg = message.content.split(/ +/);
// 			msg.shift();
// 			msg = msg.join(/ +/);
// 			message.channel.send(`Hi ${msg}! I'm Dad!\n<@${message.author.id}>`);
// 		}
// 	}
// })

client.login(env.token);
