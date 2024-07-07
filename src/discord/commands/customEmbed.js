const { SuccessEmbed, ErrorEmbed } = require("../../contracts/embedHandler.js");
const { ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { buttons } = require("../other/embedBuilder.js");
module.exports = {
  name: "embed",
  description: "Embed Builder",
  ephemeral: true,
  defer: true,
  options: [
    {
      name: "preset",
      description: "Select a preset",
      type: 3,
      required: false,
      choices: [
        {
          name: "Made by DuckySoLucky",
          value: "duckysolucky",
        },
        {
          name: "Made by Kathund",
          value: "kathund",
        },
        {
          name: "Made by george_filos",
          value: "george_filos",
        },
        {
          name: "Success Embed",
          value: "success",
        },
        {
          name: "Error Embed",
          value: "error",
        },
      ],
    },
    {
      name: "message-import",
      description: "Import a message to edit | Only discord links",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction) => {
    const preset = interaction.options.getString("preset") || null;
    let messageImport = interaction.options.getString("message-import") || null;

    let content = "";
    const embeds = [];
    const files = [];

    if (preset === "duckysolucky") {
      embeds.push(
        new EmbedBuilder().setColor(3447003).setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        }),
      );
    } else if (preset === "kathund") {
      embeds.push(
        new EmbedBuilder().setColor(3447003).setFooter({
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        }),
      );
    } else if (preset === "george_filos") {
      embeds.push(
        new EmbedBuilder().setColor(3447003).setFooter({
          text: `by @george_filos | /help [command] for more information`,
          iconURL: "https://cdn.discordapp.com/avatars/177083022305263616/4ee1d5f278a36a61aa9164b9263c8722.webp",
        }),
      );
    } else if (preset === "success") {
      embeds.push(new SuccessEmbed("Success Embed"));
    } else if (preset === "error") {
      embeds.push(new ErrorEmbed("Error Embed"));
    }

    if (messageImport) {
      if (!messageImport) {
        return await interaction.followUp({ content: "Please provoid a message link" });
      }
      if (!messageImport.includes("https://")) {
        return await interaction.followUp({ content: "Invalid message link" });
      }
      if (messageImport.startsWith("https://canary.discord.com")) {
        messageImport = messageImport.replace("canary.", "");
      }
      if (messageImport.startsWith("https://ptb.discord.com")) {
        messageImport = messageImport.replace("ptb.", "");
      }
      if (!messageImport.startsWith("https://discord.com/channels/")) {
        return await interaction.followUp({ content: "Invalid message link | Link must be a discord message link" });
      }
      const messageLinkSplit = messageImport.split("/");
      const messageId = messageLinkSplit.pop();
      const channelId = messageLinkSplit.pop();
      const channel = await interaction.client.channels.fetch(channelId);
      const message = await channel.messages.fetch(messageId);
      content = message.content;
      message.embeds.forEach((embed) => embeds.push(new EmbedBuilder(embed)));
    }

    if (embeds.length === 0) {
      buttons.editEmbed.setDisabled(true);
      buttons.deleteEmbed.setDisabled(true);
    }
    if (files.length === 0) {
      buttons.deleteImage.setDisabled(true);
    }

    await interaction.followUp({
      content,
      embeds,
      components: [
        new ActionRowBuilder().addComponents(buttons.editMessage, buttons.addImage, buttons.deleteImage),
        new ActionRowBuilder().addComponents(buttons.addEmbed, buttons.editEmbed, buttons.deleteEmbed),
        new ActionRowBuilder().addComponents(buttons.importJson, buttons.exportJson),
        new ActionRowBuilder().addComponents(buttons.reset, buttons.send),
      ],
    });
  },
};
