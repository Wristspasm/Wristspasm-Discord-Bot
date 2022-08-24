const hypixel = require('../../contracts/API/HypixelRebornAPI') 
const { toFixed, addCommas } = require('../../contracts/helperFunctions')
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const config = require('../../../config.json')
const axios = require('axios')
const fs = require('fs')

module.exports = {
    name: 'gexpcheck',
    description: 'Shows every play that got less than required amount of GEXP in the last 7 days',
  
    execute: async (interaction, client) => {
        try {
            if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.commandRole)) {
                const permissionEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'An Error has occured!'})
                    .setDescription(`You do not have permission to use this command!`)
                    .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' })
                await interaction.reply({ embeds: [permissionEmbed] });
                return;
            }
            const immune = require('../../../data/guildKickImmunity.json')
            let expStr = '', expString = '';
            hypixel.getGuild("id", config.minecraft.guildID).then(async guild => {
                let i = 0;
                for (const member of guild.members) {
                    const username = (await axios.get(`${config.api.playerDBAPI}/${member.uuid}`)).data.data.player.username
                    expString += `${username} » ${member.weeklyExperience}\n`;
                    const inactivity = immune?.[`${member.uuid}`]?.data[1] > toFixed((new Date().getTime()/1000), 0) 
                    if (member.weeklyExperience < config.minecraft.guildExp && toFixed((member.joinedAtTimestamp/1000), 2) < toFixed((Date.now()/1000), 2) - 604800 && !inactivity ? true : false) {
                        expStr += `${username} » ${member.weeklyExperience}\n`;
                    }   
                    i++;
                    if (toFixed(i/guild.members.length*100, 0).endsWith('0') || toFixed(i/guild.members.length*100, 0).endsWith('5')) await interaction.editReply({content: `\`Progress:\` ${toFixed(i/guild.members.length*100, 2)}%`})
                }
                fs.writeFileSync('data/filteredExp.txt', `${expStr}`) 
                fs.writeFileSync('data/exp.txt', `${expString}`) 

                
                const selectMenu = new ActionRowBuilder().addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('select')
                        .setPlaceholder('No Filter')
                        .addOptions(
                            {
                                label: '10,000',
                                description: 'Show everyone below 10,000 Guild Experience',
                                value: 'command.guildexpcheck.selectMenu_1',
                            },
                            {
                                label: '20,000',
                                description: 'Show everyone below 20,000 Guild Experience',
                                value: 'command.guildexpcheck.selectMenu_2',
                            },
                            {
                                label: '30,000',
                                description: 'Show everyone below 30,000 Guild Experience',
                                value: 'command.guildexpcheck.selectMenu_3',
                            },
                            {
                                label: '40,000',
                                description: 'Show everyone below 40,000 Guild Experience',
                                value: 'command.guildexpcheck.selectMenu_4',
                            },
                            {
                                label: `${config.minecraft.guildExp}`,
                                description: `(Default) Show everyone below ${config.minecraft.guildExp} Guild Experience`,
                                value: `command.guildexpcheck.selectMenu_5`,
                            }
                        ),
                    );

                const kickButton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('guild.guildexpcheck.button.kick_inactive')
                        .setLabel('Kick')
                        .setStyle(ButtonStyle.Danger),
                    );

                await interaction.editReply({ files: [ "data/exp.txt" ], content: "**Weekly Guild Experience**"})
                await interaction.followUp({ files: [ "data/filteredExp.txt" ], content: `**Weekly Guild Experience** (${config.minecraft.guildExp})`, components: [selectMenu, kickButton] })


            }).catch((error)=>{console.log(error)});
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(15548997)
                .setAuthor({ name: 'An Error has occurred'})
                .setDescription(error)
                .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });
            await interaction.followUp({ embeds: [errorEmbed] });
        }
    },
  };