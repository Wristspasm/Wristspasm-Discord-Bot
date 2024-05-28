const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "delete-roles",
  description: "Delete specific roles.",
  options: [],
  moderatorOnly: true,

  execute: async (interaction) => {
    const guildRoles = interaction.guild.roles.cache.filter(
      (role) =>
        role.name.includes("Bedwars") ||
        role.name.includes("Skywars") ||
        (role.name.includes("[") && role.name.includes("]")) ||
        role.name.includes("Duels"),
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

    // fs.writeFileSync("./roles.json", JSON.stringify(roles));

    const successEmbed = new EmbedBuilder()
      .setTitle("Success!")
      .setDescription(`Successfully deleted \`${guildRoles.size}\` roles.`)
      .setColor("#00ff00");

    await interaction.editReply({ embeds: [successEmbed] });
  },
};
