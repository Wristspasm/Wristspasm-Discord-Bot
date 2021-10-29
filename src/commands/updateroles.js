const cfg = require("../../config.json");

const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("updateroles")
        .setDescription("Update someone elses roles")
        .addUserOption(option => option.setName("member").setDescription("The username of the roles to update").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {

        if (interaction.user.id !== "597603275365285901") {
            interaction.reply("This command is disabled for developement purposes");
            return;
        }

        const member = interaction.guild.members.fetch(interaction.options.getUser("member"));

        fs.readFile(`data/${(await member).user.id}`, (err, data) => {
            if (err) {
                interaction.reply("That user hasn't linked their account!");
                return;
            }

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
                        (await member).roles.add(interaction.guild.roles.cache.get(cfg.guild_role_id)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else {
                        if ((await member).roles.has(interaction.guild.roles.cache.get(cfg.guild_role_id))) (await member).roles.remove(interaction.guild.roles.cache.get(cfg.guild_role_id)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    }

                    const bw = player.stats.bedwars.level/100;
                    const sw = player.stats.skywars.level/5;
                    const d = player.stats.duels.wins;

                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw3k0))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw3k0)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k9))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k9)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k8))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k8)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k7))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k7)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k6))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k6)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k5))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k5)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k4))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k4)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k3))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k3)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k2))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k2)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k1))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k1)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k0))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k0)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k9))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k9)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k8))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k8)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k7))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k7)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k6))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k6)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k5))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k5)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k4))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k4)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k3))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k3)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k2))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k2)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k1))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k1)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k0))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k0)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw900))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw900)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw800))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw800)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw700))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw700)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw600))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw600)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw500))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw500)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw400))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw400)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw300))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw300)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw200))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw200)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw100))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw100)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.bw000))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.bw000)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));

                    if (bw >= 30) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw3k0)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 29) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k9)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 28) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k8)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 27) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k7)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 26) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k6)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 25) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k5)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 24) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k4)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 23) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k3)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 22) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k2)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 21) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k1)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 20) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw2k0)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 19) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k9)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 18) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k8)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 17) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k7)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 16) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k6)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 15) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k5)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 14) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k4)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 13) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k3)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 12) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k2)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 11) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k1)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 10) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw1k0)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 9) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw900)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 8) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw800)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 7) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw700)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 6) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw600)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 5) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw500)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 5) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw400)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 3) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw300)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 2) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw200)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (bw >= 1) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw100)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.bw000)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    }

                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw00))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw00)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw05))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw05)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw10))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw10)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw15))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw15)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw20))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw20)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw25))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw25)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw30))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw30)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw35))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw35)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await (await member)).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw40))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw40)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw45))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw45)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.sw50))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.sw50)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));

                    if (sw >= 10) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw50)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (sw >= 9) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw45)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (sw >= 8) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw40)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (sw >= 7) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw35)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (sw >= 6) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw30)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (sw >= 5) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw25).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`)));
                    } else if (sw >= 5) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw20)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (sw >= 3) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw15)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (sw >= 2) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw10)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (sw >= 1) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw05)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.sw00)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    }

                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d100))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d100)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d200))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d200)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d500))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d500)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d1k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d1k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d2k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d2k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d4k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d4k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d10k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d10k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    if ((await member).roles.cache.has(interaction.guild.roles.cache.get(cfg.stat_roles.d20k))) await (await member).roles.remove(interaction.guild.roles.cache.get(cfg.stat_roles.d20k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));

                    if (d >= 20000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d20k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (d >= 10000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d10k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (d >= 4000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d4k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (d >= 2000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d2k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (d >= 1000) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d1k)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (d >= 500) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d500)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (d >= 200) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d200)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    } else if (d >= 100) {
                        await (await member).roles.add(interaction.guild.roles.cache.get(cfg.stat_roles.d100)).catch(err => interaction.reply(`There was an error while running this command, Console Error: ${err}`));
                    }

                    interaction.reply("Updated roles!");
                    return;
                }).catch(err => {
                    err => interaction.reply(`There was an error while running this command, Console Error: ${err}`)(err);
                    interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
                });
            }).catch(err => {
                err => interaction.reply(`There was an error while running this command, Console Error: ${err}`)(err);
                interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
            });
        });
    }
}