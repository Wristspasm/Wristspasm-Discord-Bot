const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ChannelType,
  ButtonStyle,
} = require("discord.js");
const { Embed, SuccessEmbed } = require("../../contracts/embedHandler.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const WristSpasmError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const fs = require("fs");

const permissions = [
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.UseExternalEmojis,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.EmbedLinks,
];

module.exports = {
  name: "open-ticket",
  description: "Open a support ticket.",
  defer: true,
  options: [
    {
      name: "reason",
      description: "The reason for opening a ticket",
      type: 3,
      required: false,
    },
  ],

  execute: async (interaction, type = null, giveawayId = null) => {
    const reason = interaction.options?.getString("reason") ?? "No Reason Provided";
    const userRoles = interaction.member.roles.cache.map((role) => role.id);
    if (type && type === "staff" && !userRoles.includes(config.discord.roles.guildMemberRole)) {
      const noPermissionEmbed = new Embed(
        16711680,
        "No Permission",
        "You are not a member of the guild and cannot apply for staff.",
        {
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        }
      );
      await interaction.followUp({ embeds: [noPermissionEmbed], ephemeral: true });
      return;
    }
    const channelPerms = [
      { id: interaction.user.id, allow: permissions },
      { id: interaction.client.user.id, allow: permissions },
      { id: interaction.guild.roles.everyone.id, deny: permissions },
    ];
    config.discord.commands.commandRoles.forEach((role) => {
      channelPerms.push({ id: role, allow: permissions });
    });

    let giveaway = null;
    let giveawayEmbed = null;
    if (giveawayId) {
      const giveawayData = JSON.parse(fs.readFileSync("data/giveaways.json", "utf-8"));
      giveaway = giveawayData.find((x) => x.id === giveawayId);
      if (giveaway) {
        const userIndex = giveaway.users.findIndex((user) => user.id === interaction.user.id);
        if (userIndex === -1) {
          return await interaction.editReply({ content: "You are not in the giveaway." });
        }
        const user = giveaway.users[userIndex];
        if (!user.winner) {
          return await interaction.editReply({ content: "You did not win the giveaway." });
        }
        if (user.claimed) {
          return await interaction.editReply({ content: "You have already claimed your prize." });
        }
        giveawayEmbed = new EmbedBuilder()
          .setColor(3447003)
          .setTitle("Giveaway")
          .addFields(
            {
              name: "Prize",
              value: `${giveaway.prize}`,
              inline: true,
            },
            {
              name: "Host",
              value: `<@${giveaway.host}>`,
            }
          )
          .setFooter({
            text: `by @kathund. | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png",
          });
        giveaway.users.find((x) => x.id === interaction.user.id).claimed = true;
        fs.writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));
        channelPerms.push({ id: giveaway.host, allow: permissions });
      }
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.member.displayName ?? interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: config.discord.channels.ticketsCategory,
      permissionOverwrites: channelPerms,
    });

    const ticketEmbed = new Embed(
      2067276,
      "Ticket Opened",
      `Ticket opened by <@${interaction.user.id}>\n\nReason: ${reason}`,
      {
        text: `by @kathund. | /help [command] for more information`,
        iconURL: "https://i.imgur.com/uUuZx2E.png",
      }
    );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Close Ticket").setCustomId(`t.c.${channel.id}`).setStyle(ButtonStyle.Danger)
    );

    const openMessage = await channel.send({
      content: `<@${interaction.user.id}> | ${reason}`,
      embeds: [ticketEmbed],
      components: [row],
    });
    let staffPing;
    if (giveaway === null) {
      staffPing = await channel.send({
        content: `${config.discord.commands.commandRoles.map((role) => `<@&${role}>`).join(" ")}`,
      });
    }
    await delay(500);
    await openMessage.pin();
    if (giveaway === null) await staffPing.delete();
    if (giveaway && giveawayEmbed) {
      await channel.send({ embeds: [giveawayEmbed], content: `<@${interaction.user.id}> <@${giveaway.host}>` });
    }

    if (type) {
      switch (type) {
        case "r": {
          const reportEmbed = new Embed(
            16711680,
            "Report a Guild Member",
            "Please provide the name of the player you are reporting.",
            {
              text: `by @kathund. | /help [command] for more information`,
              iconURL: "https://i.imgur.com/uUuZx2E.png",
            }
          );
          await openMessage.reply({ embeds: [reportEmbed] });
          break;
        }
        case "s": {
          const suggestionEmbed = new Embed(
            16776960,
            "Give a Suggestion",
            "Please provide a short description of your suggestion.",
            {
              text: `by @kathund. | /help [command] for more information`,
              iconURL: "https://i.imgur.com/uUuZx2E.png",
            }
          );
          await openMessage.reply({ embeds: [suggestionEmbed] });
          break;
        }
        case "q": {
          const questionEmbed = new Embed(
            16776960,
            "Questions or Concerns",
            "Please provide a detailed description of your question or concern.",
            {
              text: `by @kathund. | /help [command] for more information`,
              iconURL: "https://i.imgur.com/uUuZx2E.png",
            }
          );
          await openMessage.reply({ embeds: [questionEmbed] });
          break;
        }
        case "staff": {
          const questionEmbed = new Embed(
            16776960,
            "Staff Application",
            'Please answer these questions in detail.\n\nSay "cancel" to close the ticket and stop the application.',
            {
              text: `by @kathund. | /help [command] for more information`,
              iconURL: "https://i.imgur.com/uUuZx2E.png",
            }
          );
          await openMessage.reply({ embeds: [questionEmbed] });
          break;
        }
        // Other
        default: {
          const supportEmbed = new Embed(
            16776960,
            "General Support",
            "Please provide a detailed description of your issue.",
            {
              text: `by @kathund. | /help [command] for more information`,
              iconURL: "https://i.imgur.com/uUuZx2E.png",
            }
          );
          await openMessage.reply({ embeds: [supportEmbed] });
          break;
        }
      }
      if (type === "staff") {
        let msgsSent = 0;
        const reportEmbed = new Embed(
          16711680,
          "Staff Application",
          `**Question ${msgsSent + 1}/${config.other.staffApplicationQuestions.length}**\n - ${
            config.other.staffApplicationQuestions[msgsSent]
          }`,
          {
            text: `by @kathund. | /help [command] for more information`,
            iconURL: "https://i.imgur.com/uUuZx2E.png",
          }
        );
        await channel.send({ embeds: [reportEmbed] });
        const msgs = [];
        msgs.push(`\n** Question ${msgsSent + 1}/${config.other.staffApplicationQuestions.length}**`);
        msgs.push(`- ${config.other.staffApplicationQuestions[msgsSent]}`);
        msgsSent++;
        let finished = false;
        interaction.client.on("messageCreate", async (message) => {
          if (message.author.id !== interaction.user.id) return;
          if (message.channel.id !== channel.id) return;
          if (message.author.bot) return;
          if (message.content === "cancel") {
            message.reply("Closing the ticket and stopping the application...");
            const ticketCloseCommand = interaction.client.commands.get("close-ticket");

            if (ticketCloseCommand === undefined) {
              throw new WristSpasmError("Could not find close-ticket command! Please contact an administrator.");
            }
            const chan = await interaction.guild.channels.cache.get(channel.id);
            await ticketCloseCommand.execute(interaction, chan);
          }
          if (!finished) {
            if (msgsSent === config.other.staffApplicationQuestions.length) {
              msgs.push(message.content);
              const reportEmbed = new Embed(
                16711680,
                "Staff Application",
                "Thank you for applying! Your application will be reviewed shortly.",
                {
                  text: `by @kathund. | /help [command] for more information`,
                  iconURL: "https://i.imgur.com/uUuZx2E.png",
                }
              );
              await channel.send({ embeds: [reportEmbed] });
              await channel.send(`# Application Questions\n\n_ _`);
              msgs.forEach(async (msg) => {
                await channel.send(msg);
              });
              finished = true;
            } else {
              msgs.push(message.content);
              msgs.push(`\n** Question ${msgsSent + 1}/${config.other.staffApplicationQuestions.length}**`);
              msgs.push(`- ${config.other.staffApplicationQuestions[msgsSent]}`);
              const reportEmbed = new Embed(
                16711680,
                "Staff Application",
                `**Question ${msgsSent + 1}/${config.other.staffApplicationQuestions.length}**\n - ${
                  config.other.staffApplicationQuestions[msgsSent]
                }`,
                {
                  text: `by @kathund. | /help [command] for more information`,
                  iconURL: "https://i.imgur.com/uUuZx2E.png",
                }
              );
              await channel.send({ embeds: [reportEmbed] });
              msgsSent++;
            }
          }
        });
      }
    } else {
      const supportEmbed = new Embed(
        16776960,
        "General Support",
        "Please provide a detailed description of your issue.",
        {
          text: `by @kathund. | /help [command] for more information`,
          iconURL: "https://i.imgur.com/uUuZx2E.png",
        }
      );
      if (!giveaway) await openMessage.reply({ embeds: [supportEmbed] });
    }

    const ticketOpenEmbed = new SuccessEmbed(`Ticket opened in <#${channel.id}>`, {
      text: `by @kathund. | /help [command] for more information`,
      iconURL: "https://i.imgur.com/uUuZx2E.png",
    });

    await interaction.followUp({ embeds: [ticketOpenEmbed], ephemeral: true });
  },
};
