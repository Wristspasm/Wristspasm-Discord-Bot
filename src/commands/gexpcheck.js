const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const MojangAPI = require('mojang-api');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gexpcheck")
        .setDescription("(Admin Command) Shows eeveryone that got less than 50k GEXP in the last 7 days"),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            interaction.reply("You do not have permission to use this command");
            return;
        }

        hypixel.getGuild("name", "wristspasm").then(guild => {
            let expStr = "";
            for (const member of guild.members) {
                if (member.weeklyExperience < 50000 && member.joinedAtTimestamp < Date.now() - (7*24*60*60*1000)) {
                    expStr += `${member.uuid} : ${member.weeklyExperience}\n`;
                }
            }

            fs.writeFile("data/exp.txt", `UUID : GEXP\n${expStr}`, (err) => {
                if (err) {
                    console.error(err);
                    interaction.reply(`There was an error while saving the exp file: ${err}`);
                    return;
                }
                interaction.reply({ files: [ "data/exp.txt" ], content: "Weekly GEXP file" });
                return;
            });
        }).catch(err => {
            console.error(err);
            interaction.reply(`Failed to fetch guild data: ${err}`);
        });
    }
}
