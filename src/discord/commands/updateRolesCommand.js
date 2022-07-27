const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const config = require ('../../../config.json')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { MessageEmbed, Client, Interaction } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Update your roles"),

    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
	async execute(interaction, client) {
        fs.readFile(`data/${interaction.user.id}`, (err, data) => {
            if (err) {
                const errorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'You must link your account using `/verify` before using this command.'})
                    .setDescription(`${err}`)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [errorEmbed] });
                return;
            }

            const member = interaction.guild.members.fetch(interaction.user);
            hypixel.getGuild("id", config.minecraft.guildID).then(async (guild) => {
                hypixel.getPlayer(`${data}`).then(async (player) => {
                    // Checking if player is in the guild
                    let playerIsInGuild = false;
                    for (var i = 0; i < guild.members.length; i++) {
                        if (guild.members[i].uuid == player.uuid) {
                            playerIsInGuild = true;
                            break;
                        }
                    }
                    
                    
                    // Adding or Removing Role from Guild Member
                    if (playerIsInGuild) {
                        (await member).roles.add(interaction.guild.roles.cache.get(config.roles.guildMember_role_id)).catch(console.error);
                    } else {
                        if ((await member).roles.cache.has(interaction.guild.roles.cache.get(config.roles.guildMember_role_id))) (await member).roles.remove(interaction.guild.roles.cache.get(config.roles.guildMember_role_id)).catch(console.error);
                    }

                    // Getting Player stats
                    const bwLevel = player.stats.bedwars.level;
                    const swLevel = player.stats.skywars.level/5;
                    const duelsWins = player.stats.duels.wins;
                    const bwFKDR = player.stats.bedwars.finalKDRatio;
                    const swKDR = player.stats.skywars.KDRatio;
                    const dWLR = player.stats.duels.WLRatio;
                    const uhcStars = player.stats.uhc.starLevel;

                    if (bwLevel >= 400 || bwLevel >= 300 && bwFKDR >= 5 || swLevel >= 5 || swLevel >= 4 && swKDR >= 4 || duelsWins >= 10000 || duelsWins >= 6000 && dWLR >= 4 ||uhcStars >= 6) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(config.roles.elite_role_id));
                    } else if (bwLevel >= 200 || bwLevel >= 100 & bwFKDR >= 3 || swLevel >= 3 || swLevel >= 2 && swKDR >= 2 || duelsWins >= 4000 || duelsWins >= 2000 && dWLR >= 2 || uhcStars >= 3) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(config.roles.novice_role_id));
                    }

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

                    let n = 3000
                    for (let i = bwLvLRoles.length - 1; i >= 0; i--) {
                        // console.log(`[${i}], ${bwLevel} >= ${n} = ${bwLevel >= n}`);
                        if (bwLevel >= n) {
                            (await member).roles.add(interaction.guild.roles.cache.get(bwLvLRoles[i])).catch(console.error);
                             break;
                        } else {
                            n -= 100;
                            
                        }            
                    }
                    n = 10;
                    for (let i = swLvLRoles.length - 1; i >= 0; i--) {
                        if (swLevel >= n) {
                            (await member).roles.add(interaction.guild.roles.cache.get(swLvLRoles[i])).catch(console.error);
                            break; 
                        } else {
                            n -= 1;
                        }            
                    }
                    for (let i = duelsWinsReqs.length; i > 0; i--) {
                        if (duelsWins >= duelsWinsReqs[i]) {
                            (await member).roles.add(interaction.guild.roles.cache.get(duelsRoles[i])).catch(console.error);
                            break;
                        }           
                    }
                    const errorEmbed = new MessageEmbed()
                        .setColor('#00FF00')
                        .setAuthor({ name: 'Completed!'})
                        .setDescription(`Roles have been updated!`)
                        .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                    interaction.reply({ embeds: [errorEmbed] });
                    
                }).catch(err => {
                    const errorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'An Error has occured!'})
                    .setDescription(`${err}`)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [errorEmbed] });
                });
            }).catch(err => {
                const errorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'An Error has occured!'})
                    .setDescription(`${err}`)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [errorEmbed] });
            });
        });
    }
}
