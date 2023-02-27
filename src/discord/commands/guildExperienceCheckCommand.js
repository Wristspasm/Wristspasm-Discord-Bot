const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { toFixed, addCommas } = require('../../contracts/helperFunctions')
const hypixelRebornAPI = require('../../contracts/API/HypixelRebornAPI') 
const { getUsername } = require('../../contracts/API/PlayerDBAPI');
const config = require('../../../config.json')
const fs = require('fs')

module.exports = {
    name: 'gexpcheck',
    description: 'Shows every play that got less than required amount of GEXP in the last 7 days',
  
    execute: async (interaction) => {
        try {
            const collector = interaction.channel.createMessageComponentCollector({
                compnentType: "DROPDOWN",
                time: 60 * 1000, // 60 seconds
            });

            if (!(await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole)) throw new Error("You do not have permission to use this command.");

            const inactivity = JSON.parse(fs.readFileSync('data/inactivity.json', 'utf8'));

            if (inactivity === undefined) throw new Error('No inactivity data found. Please contact an administrator.')

            const members = (await hypixelRebornAPI.getGuild("name", "WristSpasm")).members

            let string = "";
            for (const member of members) {
                if (inactivity[member.uuid]?.expiration >= Math.floor(Date.now() / 1000)) continue;

                if (member.weeklyExperience > config.minecraft.guild.guildExp) continue; 

                const username = await getUsername(member.uuid)
                string += `${username} » ${member.weeklyExperience}\n`

                const position = members.findIndex((element) => element.uuid === member.uuid)

                if (Math.floor(position / members.length * 100) % 5 === 0) await interaction.editReply({ content: `Progress: ${toFixed(position / members.length * 100, 2)}%` })
            }

            string = string.split("\n").sort((a, b) => b.split(" » ")[1] - a.split(" » ")[1]).join("\n")
            fs.writeFileSync('data/guildExperience.txt', string)
                
            const dropdownMenu = new SelectMenuBuilder()
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
                        label: `${addCommas(config.minecraft.guild.guildExp)}`,
                        description: `Show everyone below ${addCommas(config.minecraft.guild.guildExp)} Guild Experience`,
                        value: `command.guildexpcheck.selectMenu_5`,
                    }
                )
                
            await interaction.editReply({ files: [ "data/guildExperience.txt" ], content: `**Weekly Guild Experience Leaderboard**`, components: [ new ActionRowBuilder().addComponents(dropdownMenu) ] })

            collector.on("collect", async (interaction) => {
                if (interaction.customId === 'select') {
                    const guildExp = interaction.values[0].split("_")[1] * 10000
                    const guildExpFile = fs.readFileSync('data/guildExperience.txt', 'utf8').split("\n")
                    
                    let string = "";
                    for (const line of guildExpFile) {
                        if (line.split(" » ")[1] < guildExp) string += `${line}\n`
                    }
                    
                    dropdownMenu.setPlaceholder(addCommas(guildExp))

                    const button = new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Kick')
                        .setCustomId('kick')

                    await interaction.update({ files: [ { attachment: Buffer.from(string), name: 'guildExperience.txt' } ], content: `**Weekly Guild Experience** (${addCommas(guildExp)})`, components: [ new ActionRowBuilder().addComponents(dropdownMenu), new ActionRowBuilder().addComponents(button) ] })
                }

                if (interaction.customId === 'kick') {
                    const guildExp = parseInt(interaction.message.components[0].components[0].placeholder.replaceAll(",", ""))
                    const guildExpFile = fs.readFileSync('data/guildExperience.txt', 'utf8').split("\n")
                    
                    let string = "";
                    for (const line of guildExpFile) {
                        if (line.split(" » ")[1] < guildExp) string += `${line} | `
                    }

                    let response = "";
                    for (const str of string.split(" | ")) {
                        if (str === "") continue;

                        response += `/g kick ${str.split(" » ")[0]}\n`
                    }

                    await interaction.update({content: `\`\`\`${response}\`\`\``})
                }

                collector.resetTimer();
            });
    
            collector.on("end", () => {
                interaction.editReply({
                    components: [],
                });
            });
        } catch (error) {
            console.log(error)
            const errorEmbed = new EmbedBuilder()
                .setColor(15548997)
                .setAuthor({ name: 'An Error has occurred'})
                .setDescription(`\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "").replaceAll("Error: ", "")}\`\`\``)
                .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
  };