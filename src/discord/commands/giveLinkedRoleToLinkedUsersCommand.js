const WristSpasmError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "give-linked-users-role",
  description: "Give linked users a role.",
  moderatorOnly: true,
  defer: true,

  execute: async (interaction) => {
    const users = await interaction.guild.members.fetch();
    if (users === undefined) {
      throw new WristSpasmError("No guild members found!");
    }

    const linked = fs.readFileSync("data/minecraftLinked.json", "utf8");
    if (linked === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linkedUsers = JSON.parse(linked);
    if (linkedUsers === undefined) {
      throw new WristSpasmError("Failed to parse Linked data!");
    }

    const linkedUsersArray = Object.values(linkedUsers);
    if (linkedUsersArray === undefined) {
      throw new WristSpasmError("Failed to obtain keys of parsed Linked data!");
    }

    const syncLinkedData = require("./syncLinkedDataCommand.js");
    await syncLinkedData.execute(interaction, true);

    for (const id of linkedUsersArray) {
      const user = await interaction.guild.members.fetch(id).catch((_) => {});
      if (user === undefined) {
        continue;
      }

      user.roles.add(config.discord.roles.linkedRole);
      console.log(`Added role to ${user.user.username}`);
    }

    const embed = new EmbedBuilder()
      .setTitle("Success!")
      .setDescription("Added role to all linked users.")
      .setColor("#00ff00")
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    await interaction.followUp({ embeds: [embed] });
  },
};
