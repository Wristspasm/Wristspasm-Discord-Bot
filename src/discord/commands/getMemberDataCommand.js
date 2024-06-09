const WristSpasmError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const fs = require("fs");

function formatUnixTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);

  const weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
  const days = Math.floor((seconds % (60 * 60 * 24 * 7)) / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  const timeArray = [];
  if (weeks > 0) timeArray.push(`${weeks}w`);
  if (days > 0) timeArray.push(`${days}d`);
  if (hours > 0) timeArray.push(`${hours}h`);
  if (minutes > 0) timeArray.push(`${minutes}m`);
  if (remainingSeconds > 0) timeArray.push(`${remainingSeconds}s`);

  return timeArray.join(" ");
}

module.exports = {
  name: "get-member-data",
  description: "Get member data",
  moderatorOnly: true,

  execute: async (interaction) => {
    const data = JSON.parse(fs.readFileSync("data/playerData.json"));
    if (data === undefined) {
      throw new WristSpasmError("No data found");
    }

    const output = {};
    for (const [uuid, value] of Object.entries(data)) {
      const { username, joined, lastLogin, left, lastLogout, online, playtime, messages } = value;

      output[username] = {
        username: username,
        uuid: uuid,
        joined: joined,
        left: left,
        online: `${online ? "Yes" : "No"}`,
        playtimeUnix: playtime,
        playtime: `${formatUnixTime(playtime)}`,
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
          attachment: Buffer.from(
            JSON.stringify(
              Object.values(output).sort((a, b) => b.playtimeUnix - a.playtimeUnix),
              null,
              2,
            ),
          ),
          name: "memberData.json",
        },
      ],
    });
  },
};
