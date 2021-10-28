const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inactive")
        .setDescription("Send an inactivity notice to the guild staff")
        .addStringOption(option => option.setName("time").setDescription("How long you'll be inactive for").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {
        const time = interaction.options.getString("time");
        fs.readFile(`data/${interaction.user.id}`, (err, data) => {
            if (err) {
                interaction.reply("You must link your account with `/verfiy` before you can request to join the guild!");
                return;
            }

            hypixel.getPlayer(`${data}`).then(player => {
                client.channels.cache.get("740044200942239808").send(`Inactivity request\nIGN: \`${player.nickname}\`\nRequested at \`${new Date(Date.now()).toUTCString()}\`\nRequested Time: \`${time}\``);
                interaction.reply(`An inactivity request has been sent to the guild staff`);
            }).catch(err => {
                console.error(err)
                interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
            });
        });
    }
}