const config = require("../../../config.json");

let channel = null;
(async () => {
  channel = await client.channels.fetch(config.discord.channels.botLogsChannel);
})();

function discordMessage(message) {
  return channel.send(message);
}

module.exports = { discordMessage };
