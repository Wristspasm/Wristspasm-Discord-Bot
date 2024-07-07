const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "roles",
  description: "Update your current roles",
  defer: true,

  execute: async (interaction, user, type) => {
    user = await interaction.guild.members.fetch(user ?? interaction.user);
    if (user === undefined) {
      throw new WristSpasmError("No user found.");
    }

    const linkedData = fs.readFileSync("data/linked.json", "utf8");
    if (linkedData === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linked = JSON.parse(linkedData);
    if (linked === undefined) {
      throw new WristSpasmError("No verification data found. Please contact an administrator.");
    }

    const uuid = linked.find((x) => x.id === user.id)?.uuid;
    if (uuid === undefined) {
      throw new WristSpasmError("You are no verified. Please verify using /verify.");
    }

    const [guild, profile] = await Promise.all([
      hypixelRebornAPI.getGuild("name", "WristSpasm").catch(() => undefined),
      getLatestProfile(uuid).catch(() => undefined),
    ]).catch((e) => {
      console.log(e);
    });

    if (guild === undefined) {
      throw new WristSpasmError("Guild not found.");
    }

    const playerIsInGuild = guild.members.find((m) => m.uuid == uuid);
    if (playerIsInGuild) {
      user.roles.add(config.discord.roles.guildMemberRole).catch(() => {});
    } else {
      user.roles.remove(config.discord.roles.guildMemberRole).catch(() => {});
    }

    if (user.roles.cache.find((r) => r.id === config.discord.roles.linkedRole) === undefined) {
      user.roles.add(config.discord.roles.linkedRole).catch(() => {});
    }

    const sbExperience = profile?.profile?.leveling?.experience ?? 0;
    const skyblockLevel = sbExperience ? sbExperience / 100 : 0;
    if (skyblockLevel >= 240) {
      user.roles.add(config.discord.roles.sweatRole).catch((_) => {});
    } else if (skyblockLevel >= 200) {
      user.roles.add(config.discord.roles.eliteRole).catch((_) => {});
    } else {
      user.roles.add(config.discord.roles.noviceRole).catch((_) => {});
    }

    const skyblockRoles = [
      config.discord.roles.skyblockLevelRole40,
      config.discord.roles.skyblockLevelRole80,
      config.discord.roles.skyblockLevelRole120,
      config.discord.roles.skyblockLevelRole160,
      config.discord.roles.skyblockLevelRole200,
      config.discord.roles.skyblockLevelRole240,
      config.discord.roles.skyblockLevelRole280,
      config.discord.roles.skyblockLevelRole320,
      config.discord.roles.skyblockLevelRole360,
      config.discord.roles.skyblockLevelRole400,
      config.discord.roles.skyblockLevelRole440,
    ];
    const skyblockLvLReqs = [40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440];
    if (skyblockLevel) {
      for (let i = skyblockRoles.length - 1; i >= 0; i--) {
        if (skyblockLevel >= skyblockLvLReqs[i]) {
          user.roles.add(skyblockRoles[i]);
          break;
        } else {
          if (user.roles.cache.find((r) => r.id === skyblockRoles[i])) {
            user.roles.remove(skyblockRoles[i]);
          }
        }
      }
    }

    const username = await getUsername(uuid);
    user.setNickname(username).catch((_) => {});

    const updateRole = new SuccessEmbed(`Your roles have been successfully synced with \`${username ?? "Unknown"}\`!`);
    if (type === "verify") {
      updateRole.setDescription(
        `<@${user.user.id}> roles have been successfully synced with \`${username ?? "Unknown"}\`!`,
      );
      await interaction.followUp({ embeds: [updateRole], ephemeral: true });
    } else {
      await interaction.editReply({ embeds: [updateRole] });
    }
  },
};
