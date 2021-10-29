const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("(Admin Command) View the contents of a file")
        .addStringOption(option => option.setName("file").setDescription("File name").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            return;
        }

        const file = interaction.options.getString("file");
        fs.readFile(`data/${file}`, (err, data) => {
            if (err) {
                console.error(err);
                interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
                return;
            }

            const fileData = `File contents of \`data/${file}\`\n\`\`\`${data}\`\`\``;

            if (fileData.length <= 2000) {
                interaction.reply(fileData);
            } else {
                interaction.reply({ files: [ `data/${file}` ] });
            }

        });
    }
}