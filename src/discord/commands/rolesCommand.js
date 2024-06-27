const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const fs = require("fs");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const { SuccessEmbed } = require("../../contracts/embedHandler.js");

module.exports = {
  name: "roles",
  description: "Update your current roles",

  execute: async (interaction, user, type) => {
    user = await interaction.guild.members.fetch(user ?? interaction.user);
    if (user === undefined) {
      throw new WristSpasmError("No user found.");
    }

    const linkedData = fs.readFileSync("data/discordLinked.json", "utf8");
    if (linkedData === undefined) {
      throw new WristSpasmError("No linked users found!");
    }

    const linked = JSON.parse(linkedData);
    if (linked === undefined) {
      throw new WristSpasmError("No verification data found. Please contact an administrator.");
    }

    const uuid = linked[user.id];
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
      user.roles.add(config.discord.roles.guildMemberRole).catch((_) => {});
    } else {
      user.roles.remove(config.discord.roles.guildMemberRole).catch((_) => {});
    }

    if (user.roles.cache.find((r) => r.id === config.discord.roles.linkedRole) === undefined) {
      user.roles.add(config.discord.roles.linkedRole).catch((_) => {});
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
      "1239224505478680657", // @[440]
      "1205606874272243742", // @[400]
      "1204151069849165846", // @[360]
      "1204151081240625164", // @[320]
      "1204151078653005934", // @[280]
      "1204151082884796426", // @[240]
      "1204151075112882187", // @[200]
      "1204151071686004756", // @[160]
      "1204151079919427584", // @[120]
      "1204151076811571232", // @[80]
      "1204151073506599095", // @[40]
    ].reverse();
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
        `<@${user.user.id}> roles have been successfully synced with \`${username ?? "Unknown"}\`!`
      );
      await interaction.followUp({ embeds: [updateRole], ephemeral: true });
    } else {
      await interaction.editReply({ embeds: [updateRole] });
    }
  },
};
