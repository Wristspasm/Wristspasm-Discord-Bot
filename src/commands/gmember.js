const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gmember")
        .setDescription("Shows information on a guild member")
        .addStringOption(option => option.setName("ign").setDescription("Players username or UUID").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {
        const ign = interaction.options.getString("ign");

        hypixel.getPlayer(ign).then(player => {
            hypixel.getGuild("name", "wristspasm").then(guild => {
                let index = undefined;
                for (var i = 0; i < guild.members.length; i++) {
                    if (guild.members[i].uuid === player.uuid) {
                        index = 0;
                        break;
                    }
                }

                if (index == undefined) {
                    interaction.reply("That player isn't in the guild!");
                    return;
                }

                const statsEmbed = new Discord.MessageEmbed();
                statsEmbed.setColor("#ffff55");
                statsEmbed.setTitle(`Guild Member Information on '${player.nickname}'`);
                statsEmbed.addField("Rank", `${guild.members[i].rank}`, false);
                statsEmbed.addField("Weekly GEXP", `\`${guild.members[i].weeklyExperience}\``, false);
                statsEmbed.addField("Joined", `\`${new Date(guild.members[i].joinedAtTimestamp).toUTCString()}\``, false);
                statsEmbed.addField("Last Online", `\`${new Date(player.lastLoginTimestamp).toUTCString()}\``, false);
                interaction.reply({ embeds: [statsEmbed] });
            });

        }).catch(err => {
            console.error(err);
            interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
        });
    }
}
