const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");

module.exports = {
  name: "get-non-linked-members",
  description: "Get a list of all members who have not linked their account.",
  defer: true,

  execute: async (interaction) => {
    const user = interaction.member;
    if (
      config.discord.commands.checkPerms === true &&
      !(user.roles.cache.has(config.discord.commands.commandRole) || config.discord.commands.users.includes(user.id))
    ) {
      throw new WristSpasmError("You do not have permission to use this command.");
    }

    const users = await interaction.guild.members.fetch();
    if (users === undefined) {
      throw new WristSpasmError("No guild members found!");
    }

    const syncLinkedData = require("./syncLinkedDataCommand.js");
    await syncLinkedData.execute(interaction, true);
    const linked = fs.readFileSync("data/minecraftLinked.json", "utf8");
    if (linked === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linkedUsers = JSON.parse(linked);
    if (linkedUsers === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    const linkedUsersArray = Object.keys(linkedUsers);
    if (linkedUsersArray === undefined) {
      throw new WristSpasmError("Failed to obtain keys of parsed Linked data!");
    }

    if (config === undefined) {
      throw new WristSpasmError("Failed to obtain config!");
    }

    const guildMembers = (await hypixelRebornAPI.getGuild("player", bot.username)).members.map((member) => member.uuid);
    if (guildMembers === undefined) {
      throw new WristSpasmError("Failed to obtain guild members!");
    }

    const nonLinkedMembers = guildMembers.filter((member) => !linkedUsersArray.includes(member));

    const output = await Promise.all(nonLinkedMembers.map(async (member) => `- \`${await getUsername(member)}\``));
    console.log(output);

    const embed = new EmbedBuilder()
      .setTitle("Non-Linked Members")
      .setDescription(output.join("\n"))
      .setColor(3066993)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
