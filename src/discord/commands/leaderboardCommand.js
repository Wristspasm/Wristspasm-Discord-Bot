const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
const cache = new Map();

/* eslint-disable no-throw-literal */
async function getLatestProfile(uuid) {
  if (cache.has(uuid)) {
    const data = cache.get(uuid);

    if (data.last_save + 300000 > Date.now()) {
      return data;
    }
  }

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

  cache.set(uuid, output);

  return output;
}

module.exports = {
  name: "leaderboard",
  description: "leaderboard",
  moderatorOnly: true,

  execute: async (interaction) => {
    try {
      await interaction.followUp({ content: "Generating leaderboard this may take a while, please be patient." });
      const uuids = [];
      const { data } = await axios.get(
        `https://api.hypixel.net/v2/guild?player=2700c8b565c74d8e9be5eb7a6ae19295&key=${config.minecraft.API.hypixelAPIkey}`
      );
      data.guild.members.forEach((member) => {
        uuids.push(member.uuid);
      });
      const scores = [];
      for (let i = 0; i < uuids.length; i++) {
        await delay(1000);
        const profile = await getLatestProfile(uuids[i]);
        const oldProfile = JSON.parse(fs.readFileSync(`./latest/${uuids[i]}.json`));
        const newScore =
          (profile.profile.player_stats?.mythos?.burrows_dug_combat?.total || 0) +
          (profile.profile.player_stats?.mythos?.burrows_dug_treasure?.total || 0);
        const oldScore =
          (oldProfile.player_stats?.mythos?.burrows_dug_combat?.total || 0) +
          (oldProfile.player_stats?.mythos?.burrows_dug_treasure?.total || 0);
        const username = await getUsername(uuids[i]);
        scores.push({ username: username, uuid: uuids[i], score: newScore - oldScore });
      }
      scores.filter((score) => score.score > 0).sort((a, b) => b.score - a.score);
      const string = scores
        .filter((score) => score.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((score, index) => {
          return `${index + 1}. \`${score.username}\` - ${score.score}`;
        })
        .join("\n");
      const embed = new EmbedBuilder().setTitle("Leaderboard").setDescription(string).setColor("#00FF00");
      await interaction.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: "There was an error trying to execute that command!" });
    }
  },
};
