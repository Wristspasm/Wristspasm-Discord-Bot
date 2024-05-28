// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, CommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { ErrorEmbed, Embed, SuccessEmbed } = require("../../contracts/embedHandler.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { writeAt } = require("../../contracts/helperFunctions.js");
const config = require("../../../config.json");
const Logger = require("../.././Logger.js");
const fs = require("fs");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }

        if ((command.name == "inactivity" || command.name == "embed") === false) {
          await interaction.deferReply({ ephemeral: false }).catch(() => {});
        }

        if (command.moderatorOnly === true && isModerator(interaction) === false) {
          throw new WristSpasmError("You don't have permission to use this command.");
        }

        if (command.requiresBot === true && isBotOnline() === false) {
          throw new WristSpasmError("Bot doesn't seem to be connected to Hypixel. Please try again.");
        }

        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        await command.execute(interaction);
      }

      if (interaction.isButton()) {
        await interaction.deferReply({ ephemeral: true });

        // ? Apply Button
        if (interaction.customId.includes("guild.apply_button")) {
          const applyCommand = interaction.client.commands.get("apply");

          if (applyCommand === undefined) {
            throw new WristSpasmError("Could not find apply command! Please contact an administrator.");
          }

          await applyCommand.execute(interaction);
        } else if (interaction.customId.startsWith("t.c.")) {
          const ticketCloseCommand = interaction.client.commands.get("close-ticket");
          if (ticketCloseCommand === undefined) {
            throw new WristSpasmError("Could not find close-ticket command! Please contact an administrator.");
          }
          await ticketCloseCommand.execute(interaction);
        } else if (interaction.customId.startsWith("t.o.")) {
          const ticketOpenCommand = interaction.client.commands.get("open-ticket");
          if (ticketOpenCommand === undefined) {
            throw new WristSpasmError("Could not find open-ticket command! Please contact an administrator.");
          }
          if (interaction.customId.startsWith("t.o.g.")) {
            await ticketOpenCommand.execute(interaction, null, interaction.customId.split("t.o.g.")[1]);
          } else {
            await ticketOpenCommand.execute(interaction, interaction.customId.split("t.o.")[1]);
          }
        } else if (interaction.customId.startsWith("g.e.")) {
          const giveawayData = JSON.parse(fs.readFileSync("data/giveaways.json", "utf-8"));
          if (giveawayData.find((x) => x.id === interaction.customId.split("g.e.")[1])) {
            const giveaway = giveawayData.find((x) => x.id === interaction.customId.split("g.e.")[1]);
            if (giveaway.host === interaction.user.id) {
              return await interaction.followUp({ content: "You cannot enter your own giveaway.", emphemeral: true });
            }
            const userIndex = giveaway.users.findIndex((user) => user.id === interaction.user.id);
            if (userIndex !== -1) {
              const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Leave Giveaway")
                  .setCustomId(`g.l.${giveaway.id}`)
                  .setStyle(ButtonStyle.Danger),
              );

              return await interaction.followUp({
                content: "You have already entered the giveaway.",
                components: [row],
                ephemeral: true,
              });
            }

            if (giveaway.guildOnly === true && !isGuildMember(interaction)) {
              return await interaction.editReply({ content: "This giveaway is for guild members only." });
            }

            if (giveaway.verifiedOnly === true && !isVerified(interaction)) {
              return await interaction.editReply({ content: "This giveaway is for verified members only." });
            }

            giveaway.users.push({ id: interaction.user.id, winner: false, claimed: false });
            const giveawayEmbed = new EmbedBuilder()
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
                  inline: true,
                },
                {
                  name: "Entries",
                  value: `${giveaway.users.length}`,
                  inline: true,
                },
                {
                  name: "Winners",
                  value: `${giveaway.winners}`,
                },
                {
                  name: "Ends At",
                  value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
                },
              )
              .setFooter({
                text: `by @kathund. | /help [command] for more information`,
                iconURL: "https://i.imgur.com/uUuZx2E.png",
              });
            const message = await interaction.guild.channels.cache.get(giveaway.channel).messages.fetch(giveaway.id);
            await message.edit({ embeds: [giveawayEmbed] });
            fs.writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));
            return await interaction.editReply({ content: "You have successfully entered the giveaway." });
          }
        } else if (interaction.customId.startsWith("g.l.")) {
          const giveawayData = JSON.parse(fs.readFileSync("data/giveaways.json", "utf-8"));
          const giveawayId = interaction.customId.split("g.l.")[1];
          if (giveawayData.find((x) => x.id === giveawayId)) {
            const giveaway = giveawayData.find((x) => x.id === giveawayId);
            const userIndex = giveaway.users.findIndex((user) => user.id === interaction.user.id);
            if (userIndex === -1) {
              return await interaction.editReply({ content: "You are not in the giveaway." });
            }
            giveaway.users.splice(userIndex, 1);
            const giveawayEmbed = new EmbedBuilder()
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
                  inline: true,
                },
                {
                  name: "Entries",
                  value: `${giveaway.users.length}`,
                  inline: true,
                },
                {
                  name: "Winners",
                  value: `${giveaway.winners}`,
                },
                {
                  name: "Ends At",
                  value: `<t:${giveaway.endTimestamp}:f> (<t:${giveaway.endTimestamp}:R>)`,
                },
              )
              .setFooter({
                text: `by @kathund. | /help [command] for more information`,
                iconURL: "https://i.imgur.com/uUuZx2E.png",
              });
            const message = await interaction.guild.channels.cache.get(giveaway.channel).messages.fetch(giveaway.id);
            await message.edit({ embeds: [giveawayEmbed] });
            fs.writeFileSync("data/giveaways.json", JSON.stringify(giveawayData, null, 2));
            return await interaction.editReply({ content: "You have successfully left the giveaway." });
          }
        }
      }

      // ? Inactivity Form
      if (interaction.customId === "inactivityform") {
        const time = interaction.fields.getTextInputValue("inactivitytime");
        const reason = interaction.fields.getTextInputValue("inactivityreason") || "None";

        const linked = JSON.parse(fs.readFileSync("data/linked.json", "utf8"));
        if (linked === undefined) {
          throw new WristSpasmError("No verification data found. Please contact an administrator.");
        }

        const uuid = linked.find((x) => x.id === interaction.user.id)?.uuid;
        if (uuid === undefined) {
          throw new WristSpasmError("You are no verified. Please verify using /verify.");
        }

        const [guild, username] = await Promise.all([
          hypixelRebornAPI.getGuild("name", "WristSpasm"),
          getUsername(linked[interaction.user.id]),
        ]);

        if (guild === undefined) {
          throw new WristSpasmError("Guild data not found. Please contact an administrator.");
        }

        if (isNaN(time) || time < 1) {
          throw new WristSpasmError("Please enter a valid number.");
        }

        const formattedTime = time * 86400;
        if (formattedTime > 21 * 86400) {
          throw new WristSpasmError(
            "You can only request inactivity for 21 days or less. Please contact an administrator if you need more time.",
          );
        }

        const expiration = (new Date().getTime() / 1000 + formattedTime).toFixed(0);
        const date = (new Date().getTime() / 1000).toFixed(0);
        const inactivityEmbed = new Embed(
          5763719,
          "Inactivity Request",
          `\`Username:\` ${username}\n\`Requested:\` <t:${date}>\n\`Expiration:\` <t:${expiration}:R>\n\`Reason:\` ${reason}`,
        );
        inactivityEmbed.setThumbnail(`https://www.mc-heads.net/avatar/${username}`);

        const channel = interaction.client.channels.cache.get(config.discord.channels.inactivity);
        if (channel === undefined) {
          throw new WristSpasmError("Inactivity channel not found. Please contact an administrator.");
        }

        await channel.send({ embeds: [inactivityEmbed] });

        writeAt("data/inactivity.json", uuid, {
          username: username,
          uuid: uuid,
          discord: interaction.user.tag,
          discord_id: interaction.user.id,
          requested: (new Date().getTime() / 1000).toFixed(0),
          requested_formatted: new Date().toLocaleString(),
          expiration: expiration,
          expiration_formatted: new Date(expiration * 1000).toLocaleString(),
          reason: reason,
        });

        const inactivityResponse = new SuccessEmbed(
          `Inactivity request has been successfully sent to the guild staff.`,
        );

        await interaction.reply({ embeds: [inactivityResponse], ephemeral: true });
      }
    } catch (error) {
      console.log(error);

      const errrorMessage =
        error instanceof WristSpasmError
          ? ""
          : "Please try again later. The error has been sent to the Developers.\n\n";

      const errorEmbed = new ErrorEmbed(`${errrorMessage}\`\`\`${error}\`\`\``);

      await interaction.editReply({ embeds: [errorEmbed] });

      if (error instanceof WristSpasmError === false) {
        const username = interaction.user.username ?? interaction.user.tag ?? "Unknown";
        const commandOptions = JSON.stringify(interaction.options.data) ?? "Unknown";
        const commandName = interaction.commandName ?? "Unknown";
        const errorStack = error.stack ?? error ?? "Unknown";
        const userID = interaction.user.id ?? "Unknown";

        const errorLog = new ErrorEmbed(
          `Command: \`${commandName}\`\nOptions: \`${commandOptions}\`\nUser ID: \`${userID}\`\nUser: \`${username}\`\n\`\`\`${errorStack}\`\`\``,
        );
        interaction.client.channels.cache.get(config.discord.channels.loggingChannel).send({
          content: `<@&987936050649391194> <@1169174913832202306>`,
          embeds: [errorLog],
        });
      }
    }
  },
};

function isBotOnline() {
  if (bot === undefined && bot._client.chat === undefined) {
    return;
  }

  return true;
}

function isModerator(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (
    config.discord.commands.checkPerms === true &&
    !(userRoles.includes(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
  ) {
    return false;
  }

  return true;
}
function isGuildMember(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (!(userRoles.includes(config.discord.roles.guildMemberRole) || config.discord.commands.users.includes(user.id))) {
    return false;
  }

  return true;
}
function isVerified(interaction) {
  const user = interaction.member;
  const userRoles = user.roles.cache.map((role) => role.id);

  if (!(userRoles.includes(config.discord.roles.linkedRole) || config.discord.commands.users.includes(user.id))) {
    return false;
  }

  return true;
}
