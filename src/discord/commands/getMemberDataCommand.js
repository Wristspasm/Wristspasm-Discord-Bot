const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { timeSince } = require("../../contracts/helperFunctions");

module.exports = {
  name: "get-member-data",
  description: "Get member data",

  execute: async (interaction) => {
    try {
      const data = JSON.parse(fs.readFileSync("data/playerData.json"));
      if (data === undefined) {
        throw new Error("No data found");
      }

      const output = {};
      for (const [uuid, value] of Object.entries(data)) {
        const { username, joined, lastLogin, left, lastLogout, online, playtime, messages } = value;

        output[username] = {
          uuid: uuid,
          joined: joined,
          left: left,
          online: `${online ? "Yes" : "No"}`,
          playtime: `${timeSince(Date.now() - playtime)}`,
          playtimeUnix: playtime,
          lastLogin: `${new Date(lastLogin) ?? "Unknown"}`,
          lastLoginUnix: lastLogin,
          lastLogout: `${new Date(lastLogout) ?? "Unknown"}`,
          lastLogoutUnix: lastLogout,
          messagesSent: `${messages?.toLocaleString() ?? 0}`,
        };
      }

      await interaction.editReply({
        files: [
          {
            attachment: Buffer.from(JSON.stringify(output, null, 2)),
            name: "memberData.json",
          },
        ],
      });
    } catch (error) {
      console.log(error);

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
