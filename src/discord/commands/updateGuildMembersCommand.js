const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "update-guild-members",
  description: "Updates the roles of members (adds or removes Guild Member role)",
  options: [],

  execute: async (interaction) => {
    if (interaction.member.permissions.has("ADMINISTRATOR") === false) {
        throw new Error("You don't have permission to use this command.");
    }

    const linked = JSON.parse(fs.readFileSync("data/discordLinked.json", "utf8"));
    if (linked === undefined) {
        throw new Error("No verification data found. Please contact an administrator.");
    }

    const { members } = await hypixelRebornAPI.getGuild("name", "WristSpasm");
    let removedRoles = 0, addedRoles = 0;
    for (const [id, uuid] of Object.entries(linked)) {
        try {
            if (await interaction.guild.members.fetch(id) === undefined) {
                continue;
            }

            if (members.find((member) => member.uuid === uuid)) {
                if (!(await interaction.guild.members.fetch(id)).roles.cache.has(interaction.guild.roles.cache.get(config.discord.roles.guildMemberRole))) {
                    (await interaction.guild.members.fetch(id)).roles.add(interaction.guild.roles.cache.get(config.discord.roles.guildMemberRole));
                    addedRoles++;
                }
            } else {
                if ((await interaction.guild.members.fetch(id)).roles.cache.has(interaction.guild.roles.cache.get(config.discord.roles.guildMemberRole)) === true) {
                    (await interaction.guild.members.fetch(id)).roles.remove(interaction.guild.roles.cache.get(config.discord.roles.guildMemberRole));
                    removedRoles++;
                }
            }

            const progress = Math.round((Object.keys(linked).indexOf(id) / Object.keys(linked).length) * 100);

            const progressEmbed = new EmbedBuilder()    
                .setColor(5763719)
                .setAuthor({ name: "Updating Roles" })
                .setDescription(`Updating roles for <@${id}>\nProgress: \`${progress}%\``)
                .setFooter({
                    text: `by DuckySoLucky#5181 | /help [command] for more information`,
                    iconURL: "https://imgur.com/tgwQJTX.png",
                });

            await interaction.editReply({ embeds: [progressEmbed] });
        } catch (e) {
            //console.log(e)
        }
    }

    const embed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "Updating Roles" })
        .setDescription(`Successfully updated roles for \`${Object.keys(linked).length}\` users.\nAdded roles: \`${addedRoles}\`\nRemoved roles: \`${removedRoles}\``)
        .setFooter({
            text: `by DuckySoLucky#5181 | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
        });

    await interaction.editReply({ embeds: [embed] });
  },
};
