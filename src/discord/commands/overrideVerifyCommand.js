const WristSpasmError = require("../../contracts/errorHandler.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "overrideverify",
  description: "Connect your Discord account to Minecraft",
  moderatorOnly: true,
  options: [
    {
      name: "name",
      description: "Minecraft Username",
      type: 3,
      required: true,
    },
    {
      name: "user",
      description: "Discord User",
      type: 6,
      required: true,
    },
  ],

  execute: async (interaction) => {
    const linkedRole = config.discord.roles.linkedRole;
    if (linkedRole === undefined) {
      throw new WristSpasmError("The linked role does not exist. Please contact an administrator.");
    }

    const username = interaction.options.getString("name");
    if (username.length > 16) {
      throw new WristSpasmError("Invalid username.");
    }

    const id = interaction.options._hoistedOptions[1].user.id;
    const uuid = await getUUID(username);

    const verificationData = JSON.parse(fs.readFileSync("data/linked.json", "utf-8"));
    if (verificationData.find((x) => x.id === id)) {
      const updateRolesCommand = require("./rolesCommand.js");
      await updateRolesCommand.execute(interaction, await interaction.guild.members.fetch(id), "verify");
    } else if (verificationData.find((x) => x.uuid === uuid)) {
      throw new WristSpasmError("This player is already linked to another account.");
    } else {
      verificationData.push({ id: id, uuid: uuid });
      fs.writeFileSync("data/linked.json", JSON.stringify(verificationData, null, 2));
    }

    await interaction.guild.members
      .fetch(id)
      .then((member) => member.roles.add(linkedRole))
      .catch(() => {});
    await interaction.guild.members
      .fetch(id)
      .then((member) => member.setNickname(username))
      .catch(() => {});

    const successfullyLinked = new EmbedBuilder()
      .setColor(5763719)
      .setAuthor({ name: "Successfully linked!" })
      .setDescription(`\`${username}\` has been successfully linked to <@${id}>`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [successfullyLinked] });

    const updateRolesCommand = require("./rolesCommand.js");
    await updateRolesCommand.execute(interaction, await interaction.guild.members.fetch(id), "verify");
  },
};
