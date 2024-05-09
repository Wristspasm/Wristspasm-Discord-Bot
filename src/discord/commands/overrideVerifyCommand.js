const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const { writeAt } = require("../../contracts/helperFunctions.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "overrideverify",
  description: "Connect your Discord account to Minecraft",
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
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new WristSpasmError("You do not have permission to use this command.");
    }

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

    const minecraftLinked = require("../../../data/minecraftLinked.json");
    Object.keys(minecraftLinked)
      .filter((uuid) => minecraftLinked[uuid] === id)
      .map((uuid) => {
        delete minecraftLinked[uuid];
      });
    fs.writeFileSync("data/minecraftLinked.json", JSON.stringify(minecraftLinked, null, 2));

    await Promise.all([
      writeAt("data/discordLinked.json", `${id}`, `${uuid}`),
      writeAt("data/minecraftLinked.json", `${uuid}`, `${id}`),
    ]);

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
