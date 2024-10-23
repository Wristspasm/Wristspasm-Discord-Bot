const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "inactivity",
  description: "Send an inactivity notice to the guild staff",
  defer: false,

  execute: async (interaction) => {
    const modal = new ModalBuilder().setCustomId("inactivityform").setTitle("Inactivity Form");

    const time = new TextInputBuilder()
      .setCustomId("inactivitytime")
      .setLabel("How long are you gonna be inactive for?")
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(1)
      .setMaxLength(16)
      .setPlaceholder(
        "1d = 1 day, 1w = 1 week, 1m = 1 month. Please format like this or you wont set your inactivity!"
      );

    const reason = new TextInputBuilder()
      .setCustomId("inactivityreason")
      .setLabel("Why are you going to be offline (optional)?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const inactivitytime = new ActionRowBuilder().addComponents(time);
    const inactivityreason = new ActionRowBuilder().addComponents(reason);

    modal.addComponents(inactivitytime, inactivityreason);

    await interaction.showModal(modal);
  }
};
