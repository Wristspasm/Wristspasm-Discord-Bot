const cfg = require("../../config.json");

const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

const memberIsInGuild = require("../util/memberIsInGuild");

const command = {
    data: new SlashCommandBuilder()
        .setName("inactive")
        .setDescription("Send an inactivity notice to the guild staff")
        .addStringOption(option => option.setName("reason").setDescription("Why are you going to be inactive?").setRequired(true))
        .addStringOption(option => option.setName("time").setDescription("How long you'll be inactive for").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel, player) {
        
        const reason = interaction.options.getString("reason");
        const time = interaction.options.getString("time");
        
        hypixel.getGuild("id", cfg.wristspasm_id).then(hyGuild => {

            fs.readFile(`data/${interaction.user.id}`, (err, data) => {
                if (err) {
                    interaction.reply("You must link your account with `/verfiy` before you can make an inactivity notice!");
                    return;
                }

                hypixel.getPlayer(`${data}`).then(player => {

                    /**
                     * @type {number}
                     */
                    let index = undefined;
                    for (var i = 0; i < hyGuild.members.length; i++) {
                        if (hyGuild.members[i].uuid === player.uuid) {
                            index = 0;
                            break;
                        }
                    }

                    if (index == undefined) {
                        interaction.reply("You must be in the guild to use this command!");
                        return;
                    }

                    client.channels.cache.get("740044200942239808").send(`Inactivity request\nIGN: \`${player.nickname}\`\nRequested at \`${new Date(Date.now()).toUTCString()}\`\nReason: \`${reason}\`\nRequested Time: \`${time}\``);
                    interaction.reply(`An inactivity request has been sent to the guild staff`);
                }).catch(err => {
                    console.error(err)
                    interaction.reply(`There was an error while running this command, Console Error: \`${err}\``);
                });
            });
        
        });
    }
}

module.exports = command;
