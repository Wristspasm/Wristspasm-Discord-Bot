const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verifyoverride")
        .setDescription("Admin Command")
        .addStringOption(option => option.setName("ign").setDescription("Players in game name").setRequired(true))
        .addStringOption(option => option.setName("id").setDescription("Players Discord ID").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply("You do not have permission to use this command")
            return;
        }

        const ign = interaction.options.getString("ign");
        const id = interaction.options.getString("id");

        hypixel.getPlayer(ign).then(player => {
            fs.writeFile(`data/${id}`, `${player.uuid}`, (err) => {
                if (err) {
                    interaction.reply(`FS Error: ${err}`);
                }
                interaction.reply(`Linked \`<@${id}>\` to \`${player.nickname}\``);
                return;
            });

        }).catch(err => {
            interaction.reply(`${err}`);
        });
    }
}