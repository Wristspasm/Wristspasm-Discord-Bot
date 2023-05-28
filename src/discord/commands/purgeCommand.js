const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "purge",
  description: "Purge x messages from a channel.",
  options: [
    {
      name: "amount",
      description: "The amount of messages to purge. (5 by default)",
      type: 4,
      required: false,
    },
  ],

  execute: async (interaction) => {
    try {
      const amount = interaction.options.getInteger("amount") ?? 5;

      if (interaction.member.permissions.has("MANAGE_MESSAGES") === false) {
        throw new Error("You don't have permission to use this command.");
      }

      if (amount < 1 || amount > 100) {
        throw new Error("You can only purge between 1 and 100 messages.");
      }

      await interaction.channel.bulkDelete(amount);
    } catch (error) {
      console.log(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by DuckySoLucky#5181 | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
