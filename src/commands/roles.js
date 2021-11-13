const cfg = require("../../config.json");

const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Update your roles"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {
        fs.readFile(`data/${interaction.user.id}`, (err, data) => {
            if (err) {
                interaction.reply("You must link your account with `/verfiy` before you can update your roles!");
                return;
            }

            const member = interaction.guild.members.fetch(interaction.user);

            hypixel.getGuild("id", cfg.wristspasm_id).then(async (guild) => {
                hypixel.getPlayer(`${data}`).then(async (player) => {
                    let playerIsInGuild = false;
                    for (var i = 0; i < guild.members.length; i++) {
                        if (guild.members[i].uuid == player.uuid) {
                            playerIsInGuild = true;
                            break;
                        }
                    }
                    
                    if (playerIsInGuild) {
                        (await member).roles.add(interaction.guild.roles.cache.get(cfg.guild_role_id)).catch(console.error);
                    } else {
                        if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.guild_role_id))) (await member).roles.remove(interaction.guild.roles.cache.get(cfg.guild_role_id)).catch(console.error);
                    }

                    const bw = player.stats.bedwars.level/100;
                    const bw2 = player.stats.bedwars.finalKDRatio;
                    const sw = player.stats.skywars.level/5;
                    const sw2 = player.stats.skywars.KDRatio;
                    const d = player.stats.duels.wins;
                    const d2 = player.stats.duels.WLRatio;
                    const uhc = player.stats.uhc.starLevel;

                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.novice_role_id))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.novice_role_id));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.elite_role_id))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.elite_role_id));

                    if (bw >= 4 || (bw >= 3 && bw2 >= 5) || sw >= 5 || (sw >= 4 && sw2 >= 4) || d >= 10000 || (d >= 6000 && d2 >= 4) || (bw >= 3 && bw2 >= 5) || uhc >= 6) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.elite_role_id));
                    } else if (bw >= 2 || (bw >= 1 && bw2 >= 3) || sw >= 3 || (sw >= 2 && sw2 >= 2) || d >= 4000 || (d >= 2000 && d2 >= 2) || uhc >= 3) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.novice_role_id));
                    }

                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw3k0))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw3k0)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k9))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k9)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k8))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k8)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k7))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k7)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k6))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k6)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k5))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k5)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k4))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k4)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k3))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k3)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k2))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k2)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k1))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k1)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k0))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k0)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k9))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k9)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k8))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k8)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k7))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k7)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k6))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k6)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k5))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k5)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k4))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k4)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k3))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k3)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k2))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k2)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k1))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k1)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k0))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k0)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw900))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw900)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw800))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw800)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw700))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw700)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw600))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw600)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw500))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw500)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw400))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw400)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw300))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw300)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw200))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw200)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw100))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw100)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw000))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw000)).catch(console.error);

                    if (bw >= 30) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw3k0)).catch(console.error);
                    } else if (bw >= 29) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k9)).catch(console.error);
                    } else if (bw >= 28) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k8)).catch(console.error);
                    } else if (bw >= 27) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k7)).catch(console.error);
                    } else if (bw >= 26) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k6)).catch(console.error);
                    } else if (bw >= 25) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k5)).catch(console.error);
                    } else if (bw >= 24) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k4)).catch(console.error);
                    } else if (bw >= 23) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k3)).catch(console.error);
                    } else if (bw >= 22) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k2)).catch(console.error);
                    } else if (bw >= 21) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k1)).catch(console.error);
                    } else if (bw >= 20) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k0)).catch(console.error);
                    } else if (bw >= 19) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k9)).catch(console.error);
                    } else if (bw >= 18) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k8)).catch(console.error);
                    } else if (bw >= 17) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k7)).catch(console.error);
                    } else if (bw >= 16) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k6)).catch(console.error);
                    } else if (bw >= 15) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k5)).catch(console.error);
                    } else if (bw >= 14) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k4)).catch(console.error);
                    } else if (bw >= 13) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k3)).catch(console.error);
                    } else if (bw >= 12) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k2)).catch(console.error);
                    } else if (bw >= 11) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k1)).catch(console.error);
                    } else if (bw >= 10) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k0)).catch(console.error);
                    } else if (bw >= 9) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw900)).catch(console.error);
                    } else if (bw >= 8) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw800)).catch(console.error);
                    } else if (bw >= 7) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw700)).catch(console.error);
                    } else if (bw >= 6) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw600)).catch(console.error);
                    } else if (bw >= 5) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw500)).catch(console.error);
                    } else if (bw >= 4) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw400)).catch(console.error);
                    } else if (bw >= 3) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw300)).catch(console.error);
                    } else if (bw >= 2) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw200)).catch(console.error);
                    } else if (bw >= 1) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw100)).catch(console.error);
                    } else {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw000)).catch(console.error);
                    }

                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw00))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw00)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw05))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw05)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw10))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw10)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw15))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw15)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw20))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw20)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw25))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw25)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw30))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw30)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw35))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw35)).catch(console.error);
                    if ((await (await member)).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw40))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw40)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw45))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw45)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw50))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw50)).catch(console.error);

                    if (sw >= 10) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw50)).catch(console.error);
                    } else if (sw >= 9) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw45)).catch(console.error);
                    } else if (sw >= 8) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw40)).catch(console.error);
                    } else if (sw >= 7) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw35)).catch(console.error);
                    } else if (sw >= 6) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw30)).catch(console.error);
                    } else if (sw >= 5) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw25).catch(console.error));
                    } else if (sw >= 5) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw20)).catch(console.error);
                    } else if (sw >= 3) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw15)).catch(console.error);
                    } else if (sw >= 2) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw10)).catch(console.error);
                    } else if (sw >= 1) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw05)).catch(console.error);
                    } else {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw00)).catch(console.error);
                    }

                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d100))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d100)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d200))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d200)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d500))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d500)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d1k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d1k)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d2k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d2k)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d4k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d4k)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d10k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d10k)).catch(console.error);
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d20k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d20k)).catch(console.error);

                    if (d >= 20000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d20k)).catch(console.error);
                    } else if (d >= 10000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d10k)).catch(console.error);
                    } else if (d >= 4000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d4k)).catch(console.error);
                    } else if (d >= 2000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d2k)).catch(console.error);
                    } else if (d >= 1000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d1k)).catch(console.error);
                    } else if (d >= 500) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d500)).catch(console.error);
                    } else if (d >= 200) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d200)).catch(console.error);
                    } else if (d >= 100) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d100)).catch(console.error);
                    }

                    interaction.reply("Updated roles!");
                    return;
                }).catch(err => {
                    console.error(err);
                    interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
                });
            }).catch(err => {
                console.error(err);
                interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
            });
        });
    }
}