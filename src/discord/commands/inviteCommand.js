const config = require("../../../config.json");

module.exports = {
  name: "invite",
  description: "Invites the given user to the guild.",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const name = interaction.options.getString("name");
    if (
      (await interaction.guild.members.fetch(interaction.user)).roles.cache.has(
        config.discord.roles.commandRole
      )
    ) {
      bot.chat(`/g invite ${name}`);

      const embed = new EmbedBuilder()
      .setColor("#2ECC71")
      .setTitle("Guild Invite")
      .setDescription(`\`\`\`Successfully invited ${name} to the guild!\`\`\``)
      .setFooter({
        text: "by DuckySoLucky#5181 | /help [command] for more information",
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

      await interaction.followUp({
        embeds: [embed],
        ephemeral: true,
      });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor("#E74C3C")
        .setTitle("Error")
        .setDescription(`\`\`\`You do not have permission to run this command.\`\`\``)
        .setFooter({
          text: "by DuckySoLucky#5181 | /help [command] for more information",
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.followUp({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};
