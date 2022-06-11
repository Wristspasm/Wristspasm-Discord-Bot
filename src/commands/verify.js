const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

const command = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Link your Discord ID to your Minecraft UUID")
        .addStringOption(option => option.setName("ign").setDescription("Your username or UUID").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel, player) {
        const ign = interaction.options.getString("ign");

        hypixel.getPlayer(ign).then(player => {

            let found = false;
            const discordTag = player.socialMedia.forEach(media => {
                if (media.link === interaction.user.tag) {
                    found = true;
                }
            });
            if (found) {
                fs.writeFile(`data/${interaction.user.id}`, `${player.uuid}`, (err) => {
                    if (err) {
                        throw err;
                    }
                    interaction.reply(`Linked your your account to \`${player.nickname}\``);
                    return;
                });
            } else {
                interaction.reply("Your discord tag does not match your discord tag in game! make sure you link your Discord account in game first!");
            }

        }).catch(err => {
            throw err;
        });
    }
}

module.exports = command;
