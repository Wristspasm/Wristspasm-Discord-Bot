const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const { getUsername } = require("../../contracts/API/PlayerDBAPI");
const { ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "inactivity",
  description: "Send an inactivity notice to the guild staff",

  execute: async (interaction) => {
    try {
      const modal = new ModalBuilder().setCustomId("inactivityform").setTitle("Inactivity Form");

      const time = new TextInputBuilder()
        .setCustomId("inactivitytime")
        .setLabel("How long are you gonna be inactive for?")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(2)
        .setPlaceholder("1-14 days");

      const reason = new TextInputBuilder()
        .setCustomId("inactivityreason")
        .setLabel("Why are you going to be offline (optional)?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      const inactivitytime = new ActionRowBuilder().addComponents(time);
      const inactivityreason = new ActionRowBuilder().addComponents(reason);

      modal.addComponents(inactivitytime, inactivityreason);

      await interaction.showModal(modal);
    } catch (error) {
      console.log(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error.toString()}\`\`\``)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
