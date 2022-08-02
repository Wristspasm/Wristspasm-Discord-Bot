const config = require ('../../../config.json')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client, GuildMember, Interaction } = require('discord.js');
const { getUsername } = require('../../contracts/API/PlayerDBAPI')
const fs = require("fs");
process.on('uncaughtException', function (err) {console.log(err.stack)})
const immune  = require('../../../data/guildKickImmunity.json')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

//console.log(immune)


const permissionEmbed = new MessageEmbed()
    .setColor('#ff0000')
    .setAuthor({ name: 'An Error has occured!'})
    .setDescription(`You do not have permission to use this command!`)
    .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });


module.exports = {
    data: new SlashCommandBuilder()
        .setName("gexpcheck")
        .setDescription("(Admin Command) Shows everyone that got less than 50k GEXP in the last 7 days"),

    async execute(interaction, client, member) {
        try {
            await interaction.reply({content: `${client.user.username} is thinking...`, ephemeral: true });
            if (!(await member).roles.cache.has(config.discord.commandRole) && !(await member).permissions.has("ADMINISTRATOR")) {
                interaction.editReply({ content: `\u200B`, embeds: [permissionEmbed] });
                return;
            }
            let expStr = ""
            hypixel.getGuild("id", config.minecraft.guildID).then(async guild => {
                for (const member of guild.members) {
                    //console.log(member.weeklyExperience < 50000, member.joinedAtTimestamp < Date.now()/1000 - 604800, immune?.[`${member.uuid}`]?.data[1] > new Date().getTime()/1000)
                    let inactivity = immune?.[`${member.uuid}`]?.data[1] > new Date().getTime()/1000
                    if (member.weeklyExperience < 50000 && !member.joinedAtTimestamp < Date.now()/1000 - 604800 && !inactivity ? true : false) {
                        const username = await getUsername(member.uuid)
                        expStr += `${username} » ${member.weeklyExperience}\n`;
                    }   

                }
                fs.writeFileSync('data/exp.txt', `${expStr}`, err => {if (err) {console.error(err)}}) 
                interaction.editReply({ content: `\u200B`, files: [ "data/exp.txt" ], content: "**Weekly Guild Experience**", components: [row], ephemeral: false })
            }).catch((error)=>{console.log(error)});
        } catch (error) {
            console.log(error)
        }
    }
}