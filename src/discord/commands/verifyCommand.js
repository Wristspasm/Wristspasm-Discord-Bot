const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const { writeAt } = require("../../contracts/helperFunctions");
const { getUUID } = require("../../contracts/API/PlayerDBAPI");
const fs = require("fs");

module.exports = {
  name: "verify",
  description: "Connect your Discord account to Minecraft",
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const username = interaction.options.getString("name");

    try {
      const { socialMedia, nickname } = await hypixelRebornAPI.getPlayer(username);

      if (socialMedia.find((media) => media.id === "DISCORD")?.link === undefined)
        throw new Error("This player does not have a Discord linked.");

      if (socialMedia.find((media) => media.id === "DISCORD").link !== interaction.user.tag)
        throw new Error(`${username}'s linked Discord account does not match with yours.`);

      const linkedRole = interaction.guild.roles.cache.get(config.discord.roles.linkedRole);

      if (linkedRole === undefined)
        throw new Error("The verified role does not exist. Please contact an administrator.");

      const uuid = await getUUID(username);

      await interaction.guild.members.fetch(interaction.user).then((member) => member.roles.add(linkedRole));

      await interaction.guild.members.fetch(interaction.user).then((member) => member.setNickname(nickname));

      const minecraftLinked = require("../../../data/minecraftLinked.json");
      Object.keys(minecraftLinked).map((uuid) => {
        if (minecraftLinked[uuid] === interaction.user.id) delete minecraftLinked[uuid];
      });
      fs.writeFileSync("data/minecraftLinked.json", JSON.stringify(minecraftLinked, null, 2));

      await Promise.all([
        writeAt("data/discordLinked.json", `${interaction.user.id}`, `${uuid}`),
        writeAt("data/minecraftLinked.json", `${uuid}`, `${interaction.user.id}`),
      ]);

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

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(
          `\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "").replaceAll("Error: ", "")}\`\`\``
        )
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });

      if (error.toString().includes("linked") === false || error.toString().includes("[hypixel-api-reborn]")) return;

      const verificationTutorialEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ name: "Link with Hypixel Social Media" })
        .setDescription(
          `**Instructions:**\n1) Use your Minecraft client to connect to Hypixel.\n2) Once connected, and while in the lobby, right click "My Profile" in your hotbar. It is option #2.\n3) Click "Social Media" - this button is to the left of the Redstone block (the Status button).\n4) Click "Discord" - it is the second last option.\n5) Paste your Discord username into chat and hit enter. For reference: \`${interaction.user.tag}\`\n6) You're done! Wait around 30 seconds and then try again.\n\n**Getting "The URL isn't valid!"?**\nHypixel has limitations on the characters supported in a Discord username. Try changing your Discord username temporarily to something without special characters, updating it in-game, and trying again.`
        )
        .setThumbnail("https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif")
        .setTimestamp()
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.followUp({ embeds: [verificationTutorialEmbed] });
    }
  },
};
