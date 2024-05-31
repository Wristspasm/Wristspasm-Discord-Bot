const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hypixel = require("../../contracts/API/HypixelRebornAPI.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const cron = require("node-cron");
const axios = require("axios");
const fs = require("fs");

/* eslint-disable no-throw-literal */
async function getLatestProfile(uuid) {
  const [{ data: playerRes }, { data: profileRes }] = await Promise.all([
    axios.get(`https://api.hypixel.net/v2/player?key=${config.minecraft.API.hypixelAPIkey}&uuid=${uuid}`),
    axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${config.minecraft.API.hypixelAPIkey}&uuid=${uuid}`),
  ]).catch((error) => {
    throw error?.response?.data?.cause ?? "Request to Hypixel API failed. Please try again!";
  });

  if (playerRes.success === false || profileRes.success === false) {
    throw "Request to Hypixel API failed. Please try again!";
  }

  if (playerRes.player == null) {
    throw "Player not found. It looks like this player has never joined the Hypixel.";
  }

  if (profileRes.profiles == null || profileRes.profiles.length == 0) {
    throw "Player has no SkyBlock profiles.";
  }

  const profileData = profileRes.profiles.find((a) => a.selected) || null;
  if (profileData == null) {
    throw "Player does not have selected profile.";
  }

  const profile = profileData.members[uuid];
  if (profile === null) {
    throw "Uh oh, this player is not in this Skyblock profile.";
  }

  const output = {
    last_save: Date.now(),
    profiles: profileRes.profiles,
    profile: profile,
    profileData: profileData,
    playerRes: playerRes.player,
    uuid: uuid,
  };

  return output;
}

async function update() {
  const uuids = [];
  const guild = await hypixel.getGuild("name", "WristSpasm");
  guild.members.forEach((member) => uuids.push(member.uuid));
  const scores = [];
  for (let i = 0; i < uuids.length; i++) {
    await delay(500);
    const data = await getLatestProfile(uuids[i]);
    const oldProfile = JSON.parse(fs.readFileSync(`./latest/${uuids[i]}.json`));
    const newScore =
      (data.profile.player_stats?.mythos?.burrows_dug_combat?.total || 0) +
      (data.profile.player_stats?.mythos?.burrows_dug_treasure?.total || 0);
    const oldScore =
      (oldProfile.player_stats?.mythos?.burrows_dug_combat?.total || 0) +
      (oldProfile.player_stats?.mythos?.burrows_dug_treasure?.total || 0);
    scores.push({ username: data.player.displayname, uuid: uuids[i], score: newScore - oldScore });
  }
  scores.filter((score) => score.score > 0).sort((a, b) => b.score - a.score);
  const string = scores
    .filter((score) => score.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(async (score, index) => {
      return `${index + 1}. \`${score.username}\` - ${score.score}`;
    })
    .join("\n");
  const embed = new EmbedBuilder().setTitle("Leaderboard").setDescription(string).setColor(3447003);
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const channel = await client.channels.cache.get("1245739233230979074");
  const message = await channel.messages.fetch("1245892537214828636");
  await message.edit({
    content: `Last Updated: <t:${currentTimestamp}:R>\nNext Update: <t:${currentTimestamp + 1800}:R>`,
    embeds: [embed],
  });
}

cron.schedule("*/30 * * * *", update);
update();
