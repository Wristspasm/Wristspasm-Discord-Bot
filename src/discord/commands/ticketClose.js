const WristSpasmError = require("../../contracts/errorHandler.js");
const { Embed } = require("../../contracts/embedHandler.js");
const { unlinkSync, writeFileSync } = require("fs");
const config = require("../../../config.json");

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
  options: [
    {
      name: "reason",
      description: "The reason for opening a ticket",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction, channel = null) => {
    const reason = interaction.options?.getString("reason") ?? "No Reason Provided";
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
    const ticketOwnerId = firstMessage.mentions.users.first().id;

    const ticketCloseEmbed = new Embed(
      3447003,
      "Ticket Closed",
      `Ticket Opened by <@${ticketOwnerId}>\nTicket Closed by <@${interaction.user.id}>\n\nReason: ${reason}`,
      {
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      }
    );

    var ticketLogsChannel = await interaction.client.channels.cache.get(config.discord.channels.ticketsLogs);
    if (!ticketLogsChannel) {
      await interaction.followUp({ content: "Ticket Logs Channel not found using default", ephemeral: true });
      ticketLogsChannel = await interaction.client.channels.cache.get("1230420140953178202");
    }

    ticketLogsChannel.send({
      embeds: [ticketCloseEmbed],
      files: [`data/transcript-${interaction.channel.name}.txt`],
    });

    await interaction.client.users.send(ticketOwnerId, {
      embeds: [ticketCloseEmbed],
      files: [`data/transcript-${interaction.channel.name}.txt`],
    });

    unlinkSync(`data/transcript-${interaction.channel.name}.txt`);

    await interaction.followUp({ content: "Ticket Closed", ephemeral: true });
    await channel.delete();
  },
};
