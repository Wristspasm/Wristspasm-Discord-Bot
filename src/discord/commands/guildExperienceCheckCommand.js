const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const hypixelRebornAPI = require('../../contracts/API/HypixelRebornAPI');
const { getUsername } = require('../../contracts/API/PlayerDBAPI');
const config = require('../../../config.json');
const fs = require('fs');

module.exports = {
    name: 'gexpcheck',
    description: 'Shows every play that got less than required amount of GEXP in the last 7 days',
  
    execute: async (interaction) => {
        try {
            const collector = interaction.channel.createMessageComponentCollector({
                compnentType: "DROPDOWN",
                time: 60 * 1000, // 60 seconds
            });

            if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.roles.commandRole) === false) {
                throw new Error("You do not have permission to use this command.");
            }

            const inactivity = JSON.parse(fs.readFileSync('data/inactivity.json', 'utf8'));
            if (inactivity === undefined) {
                throw new Error('No inactivity data found. Please contact an administrator.')
            }

            const { members } = (await hypixelRebornAPI.getGuild("name", "WristSpasm"))
            if (members === undefined) {
                throw new Error('Failed to fetch guild data. Please contact an administrator.')
            }

            let string = "", skippedPlayers = "";
            for (const member of members) {
                if (new Date(member.joinedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 || inactivity[member.uuid]?.expiration > Math.floor(Date.now() / 1000)) {
                    skippedPlayers += `\`${await getUsername(member.uuid)}\` » Skipped due to: ${inactivity[member.uuid]?.expiration > Math.floor(Date.now() / 1000) ? `Inactivity, Reason: \`${inactivity[member.uuid]?.reason ?? "None"}\`` : `\`Joined in the last 7 days\`, Joined: <t:${Math.floor(new Date(member.joinedAt).getTime() / 1000)}:R>`}\n`
                    continue;
                }

                string += `${await getUsername(member.uuid)} » ${member.weeklyExperience}\n`

                const position = members.findIndex((element) => element.uuid === member.uuid)
                const progress = (position / members.length * 100).toFixed(2);
                
                const progressEmbed = new EmbedBuilder()    
                    .setColor(5763719)
                    .setAuthor({ name: 'Fetching Guild Experience Data' })
                    .setDescription(`**Progress:** \`${progress}%\` (\`${position}/${members.length}\`)`)
                    .setFooter({
                        text: `by DuckySoLucky#5181 | /help [command] for more information`,
                        iconURL: "https://imgur.com/tgwQJTX.png",
                    });

                await interaction.editReply({ embeds: [progressEmbed] });
            }

            // Sort members from highest to lowest weekly experience
            string = string.split("\n").sort((a, b) => b.split(" » ")[1] - a.split(" » ")[1]).join("\n")
            fs.writeFileSync('data/guildExperience.txt', string)
                
            const dropdownMenu = new SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('No Filter')
                .addOptions(
                    {
                        label: '10,000',
                        description: 'Show everyone below 10,000 Guild Experience',
                        value: 'command.guildexpcheck.10000',
                    },
                    {
                        label: '20,000',
                        description: 'Show everyone below 20,000 Guild Experience',
                        value: 'command.guildexpcheck.20000',
                    },
                    {
                        label: '30,000',
                        description: 'Show everyone below 30,000 Guild Experience',
                        value: 'command.guildexpcheck.30000',
                    },
                    {
                        label: '40,000',
                        description: 'Show everyone below 40,000 Guild Experience',
                        value: 'command.guildexpcheck.40000',
                    },
                    {
                        label: `${config.minecraft.guild.guildExp.toLocaleString()}`,
                        description: `Show everyone below ${config.minecraft.guild.guildExp.toLocaleString()} Guild Experience`,
                        value: `command.guildexpcheck.${config.minecraft.guild.guildExp}`,
                    }
                ) 
                
            await interaction.editReply({ embeds: [], files: [ "data/guildExperience.txt" ], content: `**Weekly Guild Experience Leaderboard**\n${skippedPlayers !== "" ? `\n**Skipped players:**\n${skippedPlayers}` : ``}`, components: [ new ActionRowBuilder().addComponents(dropdownMenu) ] })
            collector.resetTimer();

            collector.on("collect", async (interaction) => {
                if (interaction.customId === 'select') {
                    await interaction.deferUpdate();

                    const guildExp = parseInt(interaction.values[0].split(".")[2]);
                    if (guildExp === NaN) {
                        throw new Error("Failed to parse guild experience. Please contact an administrator.")
                    }
                    
                    const guildExpFile = fs.readFileSync('data/guildExperience.txt', 'utf8')
                    if (guildExpFile === undefined) {
                        throw new Error("Failed to read guild experience file. Please contact an administrator.")
                    }
                    
                    let string = "";
                    for (const line of guildExpFile.split("\n")) {
                        if (line.split(" » ")[1] > guildExp) continue;
                        
                        string += `${line}\n`
                    }
                    
                    dropdownMenu.setPlaceholder(guildExp.toLocaleString())

                    const button = new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Format for /g kick')
                        .setCustomId("kick");

                    await interaction.editReply({ files: [ { attachment: Buffer.from(string), name: 'guildExperience.txt' } ], content: `**Weekly Guild Experience** (${guildExp.toLocaleString()})`, components: [ new ActionRowBuilder().addComponents(dropdownMenu), new ActionRowBuilder().addComponents(button) ] })
                }

                if (interaction.customId === 'kick') {
                    await interaction.deferUpdate();

                    const guildExp = parseInt(interaction.message.components[0].components[0].placeholder.replace(",", ""));
                    if (guildExp === NaN) {
                        throw new Error("Failed to parse guild experience. Please contact an administrator.")
                    }
                    
                    const guildExpFile = fs.readFileSync('data/guildExperience.txt', 'utf8')
                    if (guildExpFile === undefined) {
                        throw new Error("Failed to read guild experience file. Please contact an administrator.")
                    }
                    
                    let string = "";
                    for (const line of guildExpFile.split("\n")) {
                        if (line.split(" » ")[1] > guildExp) continue;
                        
                        string += `\`/g kick ${line.split(" » ")[0]}\`\n`
                    }

                    const responseEmbed = new EmbedBuilder()
                        .setColor(5763719)
                        .setAuthor({ name: 'Guild Experience Kick Command' })
                        .setDescription(`**Weekly Guild Experience** (${guildExp.toLocaleString()})\n\n${string}`)
                        .setFooter({
                            text: `by DuckySoLucky#5181 | /help [command] for more information`,
                            iconURL: "https://imgur.com/tgwQJTX.png",
                        });

                    await interaction.followUp({ embeds: [responseEmbed], files: [], content: "", components: [] })
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