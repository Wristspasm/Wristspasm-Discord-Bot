const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "inactivity",
  description: "Send an inactivity notice to the guild staff",

  execute: async (interaction) => {
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
  },
};
