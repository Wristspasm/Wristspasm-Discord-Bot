const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const { getUsername } = require("../../contracts/API/PlayerDBAPI");
const { writeAt } = require("../../contracts/helperFunctions");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const Logger = require("../.././Logger");
const fs = require("fs");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command === undefined) {
          return;
        }

        if ((command.name == "inactivity") === false) {
          await interaction.deferReply({ ephemeral: false }).catch(() => {});
        }

        bridgeChat = interaction.channelId;

        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        await command.execute(interaction);
      }

      if (interaction.isButton()) {
        await interaction.deferReply({ ephemeral: true });

        // ? Apply Button
        if (interaction.customId.includes("guild.apply_button")) {
          const applyCommand = interaction.client.commands.get("apply");

          if (applyCommand === undefined) {
            throw new Error("Could not find apply command! Please contact an administrator.");
          }

          await applyCommand.execute(interaction);
        }
      }

      // ? Inactivity Form
      if (interaction.customId === "inactivityform") {
        const time = interaction.fields.getTextInputValue("inactivitytime");
        const reason = interaction.fields.getTextInputValue("inactivityreason") || "None";

        const linked = JSON.parse(fs.readFileSync("data/discordLinked.json", "utf8"));
        if (linked === undefined) {
          throw new Error("No verification data found. Please contact an administrator.");
        }

        const uuid = linked[interaction.user.id];
        if (uuid === undefined) {
          throw new Error("You are no verified. Please verify using /verify.");
        }

        const [guild, username] = await Promise.all([
          hypixelRebornAPI.getGuild("name", "WristSpasm"),
          getUsername(linked[interaction.user.id]),
        ]);

        if (guild === undefined) {
          throw new Error("Guild data not found. Please contact an administrator.");
        }

        if (isNaN(time) || time < 1) {
          throw new Error("Please enter a valid number.");
        }

        const formattedTime = time * 86400;
        if (formattedTime >= 14 * 86400) {
          throw new Error(
            "You can only request inactivity for 14 days or less. Please contact an administrator if you need more time."
          );
        }

        const expiration = (new Date().getTime() / 1000 + formattedTime).toFixed(0);
        const inactivityEmbed = new EmbedBuilder()
          .setColor(5763719)
          .setAuthor({ name: "Inactivity request." })
          .setThumbnail(`https://www.mc-heads.net/avatar/${username}`)
          .setDescription(
            `\`Username:\` ${username}\n\`Requested:\` <t:${(new Date().getTime() / 1000).toFixed(
              0
            )}>\n\`Expiration:\` <t:${expiration}:R>\n\`Reason:\` ${reason}`
          )
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });

        const channel = interaction.client.channels.cache.get(config.discord.channels.inactivity);
        if (channel === undefined) {
          throw new Error("Inactivity channel not found. Please contact an administrator.");
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

        const inactivityResponse = new EmbedBuilder()
          .setColor(5763719)
          .setAuthor({ name: "Inactivity request." })
          .setDescription(`Inactivity request has been successfully sent to the guild staff.`)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });

        await interaction.reply({ embeds: [inactivityResponse], ephemeral: true });
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
