process.on('uncaughtException', function (err) {console.log(err.stack)})
const { getUsername }= require('../../contracts/API/PlayerDBAPI')
const { getSenitherWeightUsername } = require('../../contracts/weight/senitherWeight')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require ('../../../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Update your roles"),

	async execute(interaction, client, member) {
        const linked = require('../../../data/discordLinked.json')
        await interaction.reply({content: `${client.user.username} is thinking...`, ephemeral: true });
        try {
            const username = await getUsername(linked?.[interaction.user.id]?.data[0]) 
            hypixel.getGuild("id", config.minecraft.guildID).then(async (guild) => {
                hypixel.getPlayer(username).then(async (player) => {
                    let playerIsInGuild = false;
                    for (var i = 0; i < guild.members.length; i++) {
                        if (guild.members[i].uuid == player.uuid) {
                            playerIsInGuild = true;
                            break;
                        }
                    }
                    
                    if (playerIsInGuild) {
                        (await member).roles.add(interaction.guild.roles.cache.get(config.discord.guildMemberRole)).catch(console.error);
                    } else {
                        if ((await member).roles.cache.has(interaction.guild.roles.cache.get(config.discord.guildMemberRole))) (await member).roles.remove(interaction.guild.roles.cache.get(config.discord.guildMemberRole)).catch(console.error);
                    }

                    const weight = await getSenitherWeightUsername(username)

                    const bwLevel = player.stats.bedwars.level;
                    const bwFKDR = player.stats.bedwars.finalKDRatio;

                    const swLevel = player.stats.skywars.level/5;
                    const swKDR = player.stats.skywars.KDRatio;
                    
                    const duelsWins = player.stats.duels.wins;
                    const dWLR = player.stats.duels.WLRatio;

                    if (bwLevel >= 400 || bwLevel >= 300 && bwFKDR >= 5 || swLevel >= 25 || swLevel >= 20 && swKDR >= 4 || duelsWins >= 10000 || duelsWins >= 5000 && dWLR >= 4 || weight >= 4000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(config.discord.eliteRole));
                    } 

                    
                    else if (bwLevel >= 200 || bwLevel >= 100 & bwFKDR >= 2 || swLevel >= 15 || swLevel >= 10 && swKDR >= 2 || duelsWins >= 2500 || duelsWins >= 1500 && dWLR >= 2 || weight >= 2500) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(config.discord.noviceRole));
                    }

                    // Hardcoded because I'm lazy
                    const bwLvLRoles = ["600314048617119757", "600313179452735498", "600313143398236191", "600311393316765697", "600311885971062784", "601086287285583872", "610930173675831336", "610930335135432879", "610929429635661846", "610929550674886686", "614848336649912342", "829979638495182868", "829980233365061653", "829980892897214484", "829981099248975873", "829981255609221131", "829981553563009034", "829981705548464128", "829981912847482900", "829982128296558623", "829982315831754823", "829982617369575495", "829982840472207440", "829983089539022890", "829983408628432896", "829983680126124053", "829984999948025899", "829985291678253086", "829985446943653898", "829985605144018965", "829983877300486184"];
                    const swLvLRoles = ["732768990723702915", "732769728006717572", "732769252570038283", "732769874530533407", "732769930562502696", "732770029099024425", "732770104642764910", "732770168366956577", "732770222691319870", "732770273564033026", "732770336407552070"];
                    const duelsRoles =  ["732773026273427476","732773083479408680","732773121425408063","732773215608504373","732773275070890004","732773326262632529","732773376841482260","732773463139418194"];
                    const duelsWinsReqs = [100, 200, 500, 1000, 2000, 4000, 10000, 20000];

                    for (const roleId of bwLvLRoles) {
                        if ((await member).roles.cache.has(roleId)) await (await member).roles.remove(interaction.guild.roles.cache.get(roleId));
                    }
                    for (const roleId of swLvLRoles) {
                        if ((await member).roles.cache.has(roleId)) await (await member).roles.remove(interaction.guild.roles.cache.get(roleId));
                    }
                    for (const roleId of duelsRoles) {
                        if ((await member).roles.cache.has(roleId)) await (await member).roles.remove(interaction.guild.roles.cache.get(roleId));
                    }

                    // ? Bedwars
                    let n = 3000
                    for (let i = bwLvLRoles.length - 1; i >= 0; i--) {
                        if (bwLevel >= n) {
                            (await member).roles.add(interaction.guild.roles.cache.get(bwLvLRoles[i])).catch(console.error);
                             break;
                        } else {
                            n -= 100;
                            
                        }            
                    }
                    // ? Skywars
                    n = 10;
                    for (let i = swLvLRoles.length - 1; i >= 0; i--) {
                        if (swLevel >= n) {
                            (await member).roles.add(interaction.guild.roles.cache.get(swLvLRoles[i])).catch(console.error);
                            break; 
                        } else {
                            n -= 1;
                        }            
                    }
                    // ? Duels
                    for (let i = duelsWinsReqs.length; i > 0; i--) {
                        if (duelsWins >= duelsWinsReqs[i]) {
                            (await member).roles.add(interaction.guild.roles.cache.get(duelsRoles[i])).catch(console.error);
                            break;
                        }           
                    }
                    const updateRole = new MessageEmbed()
                        .setColor('#00FF00')
                        .setAuthor({ name: 'Successfully completed'})
                        .setDescription(`Roles have been updated!`)
                        .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                    interaction.editReply({ content: `\u200B`, embeds: [ updateRole ] });
                })
            })
        } catch (error) {
            console.log(error)
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setAuthor({ name: 'An Error has occured!'})
                .setDescription(`${error}`)
                .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
            interaction.editReply({ content: `\u200B`, embeds: [errorEmbed] });
        }
    }
}