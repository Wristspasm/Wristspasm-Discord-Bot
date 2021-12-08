const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

const command = {
    data: new SlashCommandBuilder()
        .setName("ls")
        .setDescription("(Admin Command) Read the data directory"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel, player) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply("You do not have permission to use this command!");
            return;
        }

        const files = fs.readdirSync("data");

        let replyMsg = "Data Directory\n\`\`\`";

        for (const file of files) {
            replyMsg += `${file}\n`;
        }
        replyMsg += "\`\`\`";
        interaction.reply(replyMsg);
        return;
    }
}

module.exports = command;
