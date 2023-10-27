const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "delete-roles",
  description: "Delete specific roles.",
  options: [],

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new WristSpasmError("You do not have permission to use this command.");
    }

    const guildRoles = interaction.guild.roles.cache.filter(
      (role) =>
        role.name.includes("Bedwars") ||
        role.name.includes("Skywars") ||
        (role.name.includes("[") && role.name.includes("]"))
    );

    const roles = [];
    for (const role of guildRoles.values()) {
      roles.push({
        name: role.name,
        color: role.color,
        hexColor: role.hexColor,

        data: role,
      });


      // await role.delete();
    }

    fs.writeFileSync("./roles.json", JSON.stringify(roles));

    const successEmbed = new EmbedBuilder()
      .setTitle("Success!")
      .setDescription(`Successfully deleted \`${guildRoles.size}\` roles.`)
      .setColor("#00ff00");

    await interaction.editReply({ embeds: [successEmbed] });
  },
};
