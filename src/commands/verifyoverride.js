const Discord = require("discord.js");
const Hypixel = require('hypixel-api-reborn');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

const command = {
    data: new SlashCommandBuilder()
        .setName("verifyoverride")
        .setDescription("(Admin Command) Force verifies a user")
        .addStringOption(option => option.setName("ign").setDescription("Players in game name").setRequired(true))
        .addStringOption(option => option.setName("id").setDescription("Players Discord ID").setRequired(true)),

    /**
     * @param {Discord.CommandInteraction} interaction
     * @param {Discord.Client} client 
     * @param {Hypixel.Client} hypixel 
     */
    async execute(interaction, client, hypixel, player) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR") && !interaction.member.roles.includes(interaction.guild.roles.cache.get(cfg.admin_role_id))) {
            interaction.reply("You do not have permission to use this command")
            return;
        }

        const ign = interaction.options.getString("ign");
        const id = interaction.options.getString("id");

        hypixel.getPlayer(ign).then(player => {
            fs.writeFile(`data/${id}`, `${player.uuid}`, (err) => {
                if (err) {
                    throw err;
                }
                interaction.reply(`Linked \`${client.users.cache.get(id).tag}\` to \`${player.nickname}\``);
                return;
            });

        }).catch(err => {
            throw err;
        });
    }
}

module.exports = command;
