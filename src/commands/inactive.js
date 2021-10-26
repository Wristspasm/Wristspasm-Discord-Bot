const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inactive")
        .setDescription("Link your discord id to your minecraft uuid"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {
        fs.readFile(`data/${interaction.user.id}`, (err, data) => {
            if (err) {
                interaction.reply("You don't have a linked account");
                return;
            }

            hypixel.getPlayer(`${data}`).then(player => {
                client.channels.cache.get("740044200942239808").send(`Inactivity request\nIGN: \`${player.nickname}\`\nRequested at \`${new Date(Date.now()).toUTCString()}\``);
                interaction.reply(`An inactivity request has been sent to the guild staff`);
            }).catch(console.error);
        });
    }
}