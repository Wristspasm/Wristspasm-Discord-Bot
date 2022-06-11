const cfg = require("../../config.json");

const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
// const MojangAPI = require('mojang-api');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const { Player } = require("discord-player")

const command = {
    data: new SlashCommandBuilder()
        .setName("gexpcheck")
        .setDescription("(Admin Command) Shows everyone that got less than 50k GEXP in the last 7 days"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     * @param {Player} player
     */
     async execute(interaction, client, hypixel, player) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR")  && !interaction.member.roles.includes(interaction.guild.roles.cache.get(cfg.admin_role_id))) {
            interaction.reply("You do not have permission to use this command");
            return;
        }

        hypixel.getGuild("id", cfg.wristspasm_id).then(guild => {
            let expStr = "";
            for (const member of guild.members) {
                if (member.weeklyExperience < 50000 && member.joinedAtTimestamp < Date.now() - (7*24*60*60*1000)) {
                    expStr += `${member.uuid} : ${member.weeklyExperience}\n`;
                }
            }

            fs.writeFile("data/exp.txt", `UUID : GEXP\n${expStr}`, (err) => {
                if (err) {
                    throw err;
                    return;
                }
                interaction.reply({ files: [ "data/exp.txt" ], content: "Weekly GEXP file" });
                return;
            });
        }).catch(err => {
            throw err;
        });
    }
}

module.exports = command;
