const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "verify",
  description: "Connect your Discord account to Minecraft",
  defer: true,
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    try {
      const username = interaction.options.getString("name");
      const { socialMedia, nickname } = await hypixelRebornAPI.getPlayer(username);
      if (socialMedia.find((media) => media.id === "DISCORD")?.link === undefined) {
        throw new WristSpasmError("This player does not have a Discord linked.");
      }

      const discordUsername = socialMedia.find((media) => media.id === "DISCORD")?.link;
      if (discordUsername === undefined) {
        throw new WristSpasmError("This player does not have a Discord linked.");
      }

      const linkedAccount = interaction.user.username;
      if (linkedAccount === undefined) {
        throw new WristSpasmError("You do not exist? Please contact an administrator.");
      }

      if (discordUsername !== linkedAccount) {
        throw new WristSpasmError(
          `The player '${username}' has linked their Discord account to a different account ('${discordUsername}').`,
        );
      }

      const linkedRole = interaction.guild.roles.cache.get(config.discord.roles.linkedRole);
      if (linkedRole === undefined) {
        throw new WristSpasmError("The verified role does not exist. Please contact an administrator.");
      }

      const uuid = await getUUID(username);
      if (uuid === undefined) {
        throw new WristSpasmError("Failed to obtain UUID of player.");
      }

      const verificationData = JSON.parse(fs.readFileSync("data/linked.json", "utf-8"));
      if (verificationData.find((x) => x.id === interaction.user.id)) {
        const updateRolesCommand = require("./rolesCommand.js");
        await updateRolesCommand.execute(
          interaction,
          await interaction.guild.members.fetch(interaction.user.id),
          "verify",
        );
      } else if (verificationData.find((x) => x.uuid === uuid)) {
        throw new WristSpasmError("This player is already linked to another account.");
      } else {
        verificationData.push({ id: interaction.user.id, uuid: uuid });
        fs.writeFileSync("data/linked.json", JSON.stringify(verificationData, null, 2));
      }

      const user = await interaction.guild.members.fetch(interaction.user);
      user.roles.add(linkedRole).catch(() => {});
      user.setNickname(nickname).catch(() => {});

      const successfullyLinked = new EmbedBuilder()
        .setColor("4BB543")
        .setAuthor({ name: "Successfully linked!" })
        .setDescription(`Your account has been successfully linked to \`${nickname}\``)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [successfullyLinked] });

      const updateRolesCommand = require("./rolesCommand.js");
      await updateRolesCommand.execute(interaction, interaction.user, "verify");
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line no-ex-assign
      error = error
        .toString()
        .replaceAll("Error: [hypixel-api-reborn] ", "")
        .replaceAll(
          "Unprocessable Entity! For help join our Discord Server https://discord.gg/NSEBNMM",
          "This player does not exist. (Mojang API might be down)",
        );

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });

      if (
        (error.statsWith("The player '") &&
          error.includes("has linked their Discord account to a different account")) === true
      ) {
        const verificationTutorialEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setAuthor({ name: "Link with Hypixel Social Media" })
          .setDescription(
            `**Instructions:**\n1) Use your Minecraft client to connect to Hypixel.\n2) Once connected, and while in the lobby, right click "My Profile" in your hotbar. It is option #2.\n3) Click "Social Media" - this button is to the left of the Redstone block (the Status button).\n4) Click "Discord" - it is the second last option.\n5) Paste your Discord username into chat and hit enter. For reference: \`${
              interaction.user.username ?? interaction.user.tag
            }\`\n6) You're done! Wait around 30 seconds and then try again.\n\n**Getting "The URL isn't valid!"?**\nHypixel has limitations on the characters supported in a Discord username. Try changing your Discord username temporarily to something without special characters, updating it in-game, and trying again.`,
          )
          .setThumbnail("https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif")
          .setTimestamp()
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });

        await interaction.followUp({ embeds: [verificationTutorialEmbed] });
      }
    }
  },
};
