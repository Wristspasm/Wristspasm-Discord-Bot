const config = require("../../config.json");
const hypixel = require('../handlers/Hypixel')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
        .setName("gmember")
        .setDescription("Shows information on a guild member")
        .addStringOption(option => option.setName("ign").setDescription("Players username or UUID").setRequired(true)),

     async execute(interaction, client) {
        const ign = interaction.options.getString("ign");
        let found = false;
        hypixel.getPlayer(ign).then(player => {
            hypixel.getGuild("id", config.minecraft.guild_id).then(guild => {
                for (var i = 0; i < guild.members.length; i++) {
                    if (guild.members[i].uuid === player.uuid) {
                        found = true;
                        break;
                    }
                }
                if (found == false || found == undefined) {
                    const errorEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setAuthor({ name: 'An Error has occured!'})
                        .setDescription(`This player is not in the guild.`)
                        .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                    interaction.reply({ embeds: [errorEmbed] });
                    return;
                }

                const statsEmbed = new MessageEmbed()
                    .setColor("#ffff55")
                    .setAuthor({ name: `${player.nickname}`})
                    .setThumbnail(`https://www.mc-heads.net/avatar/${player.nickname}`) 
                    .addField("Rank", `${guild.members[i].rank}`, false)
                    .addField("Weekly GEXP", `\`${guild.members[i].weeklyExperience}\``, false)
                    .addField("Joined", `\`${new Date(guild.members[i].joinedAtTimestamp).toUTCString()}\``, false)
                    .addField("Last Online", `\`${player.lastLoginTimestamp < 3715200000 ? "Unknown" : new Date(player.lastLoginTimestamp).toUTCString()}\``, false)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [statsEmbed] })
            });

        }).catch(err => {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setAuthor({ name: 'An Error has occured!'})
                .setDescription(`${err}`)
                .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
            interaction.reply({ embeds: [errorEmbed] });
        });
    }
}
