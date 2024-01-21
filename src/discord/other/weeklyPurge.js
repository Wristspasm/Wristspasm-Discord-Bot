const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { getUsername } = require("../../contracts/API/PlayerDBAPI.js");
const { Embed } = require("../../contracts/embedHandler.js");
const cron = require("node-cron");
const fs = require("fs");

cron.schedule("0 0 * * 1", async () => {
  await new Promise((resolve) => {
    client.once("ready", resolve);
  });

  const inactivity = JSON.parse(fs.readFileSync("data/inactivity.json", "utf8"));
  if (inactivity === undefined) {
    return;
  }

  const { members } = await hypixelRebornAPI.getGuild("name", "WristSpasm");
  if (members === undefined) {
    return;
  }

  const output = {};
  for (const member of members) {
    const joinedInLast7Days = new Date(member.joinedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
    const inactivityExpired = inactivity[member.uuid]?.expiration > Math.floor(Date.now() / 1000);
    const username = await getUsername(member.uuid);

    if (joinedInLast7Days || inactivityExpired || member.weeklyExperience > 50000) {
      continue;
    }

    output[username] = member.weeklyExperience;
  }

  const sorted = Object.entries(output).sort(([, a], [, b]) => a - b);

  const list = sorted
    .map(([username, weeklyExperience]) => `\`${username}\` » ${weeklyExperience.toLocaleString()}\n`)
    .join("");

  const channel = await client.channels.fetch("1070774833916424253");
  if (list.length > 2048) {
    fs.writeFileSync("data/weeklyPurge.txt", list.replaceAll("`", ""));

    await channel.send({
      content: "The weekly purge is too large to send as a message, so here's a file instead.",
      files: ["data/weeklyPurge.txt"],
    });
  } else {
    const embed = new Embed(3447003, "Weekly Purge", list);

    await channel.send({ embeds: [embed] });
  }
});
