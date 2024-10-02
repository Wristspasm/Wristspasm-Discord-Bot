const WristSpasmError = require("../../contracts/errorHandler.js");
const { unlinkSync, writeFileSync } = require("fs");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");

function getTimeStamp(unixTimeStamp) {
  return new Date(unixTimeStamp).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZoneName: "short",
    timeZone: "UTC",
  });
}

module.exports = {
  name: "close-ticket",
  description: "Close a support ticket.",
  moderatorOnly: true,
  defer: true,
  options: [
    {
      name: "reason",
      description: "The reason for opening a ticket",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction, channel = null) => {
    const closeReason = interaction.options?.getString("reason") ?? "No Reason Provided";
    if (channel === null) {
      channel = interaction.channel;
    }
    if (!channel.name.toLowerCase().startsWith("ticket-")) {
      throw new WristSpasmError("This is not a ticket channel");
    }

    let messages = [];
    let lastMessageId = null;

    do {
      const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
      if (fetchedMessages.size === 0) break;

      fetchedMessages.forEach((msg) => messages.push(msg));
      lastMessageId = fetchedMessages.last().id;
    } while (true);

    messages = messages
      .filter((msg) => !msg.author.bot || msg.author.id === interaction.client.user.id)
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    let TranscriptString = "";
    messages.forEach((msg) => {
      TranscriptString += `[${getTimeStamp(msg.createdTimestamp)}] | @${msg.author.username} (${msg.author.id}) | ${
        msg.content
      }\n`;
    });

    writeFileSync(`data/transcript-${interaction.channel.name}.txt`, TranscriptString);

    const firstMessage = (await channel.messages.fetchPinned()).first();
    const openTimestamp = Math.floor(firstMessage.createdTimestamp / 1000);
    let openReason = "No Reason Provided";
    if (firstMessage.content.includes(" | ")) {
      openReason = firstMessage.content.split(" | ")[1];
    }
    const closeTimestamp = Math.floor(Date.now() / 1000);
    const ticketOwnerId = firstMessage.mentions.users.first().id;

    const ticketCloseEmbed = new EmbedBuilder()
      .setColor(3447003)
      .setTitle("Ticket Closed")
      .addFields(
        {
          name: "Ticket Open",
          value: `by: <@${ticketOwnerId}>\nTimestamp: <t:${openTimestamp}> (<t:${openTimestamp}:R>)\nReason: ${openReason}`,
        },
        {
          name: "Ticket Closed",
          value: `by: <@${interaction.user.id}>\nTimestamp: <t:${closeTimestamp}> (<t:${closeTimestamp}:R>)\nReason: ${closeReason}`,
        }
      )
      .setFooter({
        text: `by @.kathund | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      });

    var ticketLogsChannel = await interaction.client.channels.cache.get(config.discord.channels.ticketsLogs);
    if (!ticketLogsChannel) {
      await interaction.followUp({ content: "Ticket Logs Channel not found using default", ephemeral: true });
      ticketLogsChannel = await interaction.client.channels.cache.get("1230420140953178202");
    }

    ticketLogsChannel.send({
      embeds: [ticketCloseEmbed],
      files: [`data/transcript-${interaction.channel.name}.txt`],
    });

    try {
      await interaction.client.users.send(ticketOwnerId, {
        embeds: [ticketCloseEmbed],
        files: [`data/transcript-${interaction.channel.name}.txt`],
      });
    } catch (e) {
      await interaction.followUp({ content: "User has DMs disabled", ephemeral: true });
    }

    unlinkSync(`data/transcript-${interaction.channel.name}.txt`);

    await interaction.followUp({ content: "Ticket Closed", ephemeral: true });
    await channel.delete();
  },
};
