const config = require("../../../config.json");
const { readFileSync } = require("fs");
const cron = require("node-cron");

function boarPing() {
  const boarData = readFileSync("data/boar.json");
  if (!boarData) return;
  const boar = JSON.parse(boarData);
  if (!boar) return;
  let message = "";

  boar.forEach((user) => (message += `<@${user}> `));

  client.channels.fetch(config.discord.channels.boarChannel).then((channel) => {
    channel.send(message);
  });
}

cron.schedule(`0 0 * * *`, () => boarPing(), { scheduled: true, timezone: "UTC" });
