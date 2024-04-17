const config = require("../../../config.json");

function discordMessage(message) {
  client.channels.fetch(config.discord.channels.botLogsChannel).then((channel) => {
    channel.send(message);
  });
  return;
}

module.exports = { discordMessage };
