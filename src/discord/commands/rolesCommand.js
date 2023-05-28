const { getLatestProfile } = require("../../../API/functions/getLatestProfile");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "roles",
  description: "Update your current roles",

  execute: async (interaction, user, type) => {
    try {
      user = user ?? interaction.user;
      const linkedData = fs.readFileSync("data/discordLinked.json", "utf8");
      if (linkedData === undefined) {
        throw new Error("No linked users found!");
      }

      const linked = JSON.parse(linkedData);
      if (linked === undefined) {
        throw new Error(
          "No verification data found. Please contact an administrator."
        );
      }

      const uuid = linked[user.id];
      if (uuid === undefined) {
        throw new Error("You are no verified. Please verify using /verify.");
      }

      const [guild, player, profile] = await Promise.all([
        hypixelRebornAPI.getGuild("name", "WristSpasm"),
        hypixelRebornAPI.getPlayer(uuid),
        getLatestProfile(uuid).catch((_) => undefined),
      ]);

      if (guild === undefined) {
        throw new Error("Guild not found.");
      }

      const playerIsInGuild = guild.members.find((m) => m.uuid == uuid);
      user = await interaction.guild.members.fetch(user);

      if (playerIsInGuild) {
        user.roles.add(config.discord.roles.guildMemberRole);
      } else {
        user.roles
          .remove(config.discord.roles.guildMemberRole)
          .catch((_) => {});
      }

      const skyblockLevel = (profile?.profile?.leveling?.experience / 100) ?? 0;
      const bwLevel = player.stats.bedwars.level;
      const swLevel = player.stats.skywars.level / 5;
      const duelsWins = player.stats.duels.wins;

      // ? Elite
      if (bwLevel >= 400 || skyblockLevel >= 200) {
        user.roles.add(config.discord.roles.eliteRole);
      }

      const bwLvLRoles = [
        "600314048617119757",
        "600313179452735498",
        "600313143398236191",
        "600311393316765697",
        "600311885971062784",
        "601086287285583872",
        "610930173675831336",
        "610930335135432879",
        "610929429635661846",
        "610929550674886686",
        "614848336649912342",
        "829979638495182868",
        "829980233365061653",
        "829980892897214484",
        "829981099248975873",
        "829981255609221131",
        "829981553563009034",
        "829981705548464128",
        "829981912847482900",
        "829982128296558623",
        "829982315831754823",
        "829982617369575495",
        "829982840472207440",
        "829983089539022890",
        "829983408628432896",
        "829983680126124053",
        "829984999948025899",
        "829985291678253086",
        "829985446943653898",
        "829985605144018965",
        "829983877300486184",
      ];
      const swLvLRoles = [
        "732768990723702915",
        "732769728006717572",
        "732769252570038283",
        "732769874530533407",
        "732769930562502696",
        "732770029099024425",
        "732770104642764910",
        "732770168366956577",
        "732770222691319870",
        "732770273564033026",
        "732770336407552070",
      ];
      const duelsRoles = [
        "732773026273427476",
        "732773083479408680",
        "732773121425408063",
        "732773215608504373",
        "732773275070890004",
        "732773326262632529",
        "732773376841482260",
        "732773463139418194",
      ];
      const duelsWinsReqs = [100, 200, 500, 1000, 2000, 4000, 10000, 20000];
      const skyblockRoles = [
        "1088226876541116426",
        "1088211267405230091",
        "1088211502210748578",
        "1088211658104651927",
        "1088212789681733772",
        "1088211782163767418",
        "1088211901529465006",
        "1088212049726816337",
        "1088212180605861928",
        "1088212296326709319",
      ];
      const skyblockLvLReqs = [1, 40, 80, 120, 160, 200, 240, 280, 320, 360];

      for (const roleId of bwLvLRoles.concat(
        swLvLRoles,
        duelsRoles,
        skyblockRoles
      )) {
        if (user.roles.cache.has(roleId)) {
          await user.roles.remove(roleId).catch((_) => {});
        }
      }

      // ? Bedwars
      for (let i = bwLvLRoles.length - 1; i > 0; i--) {
        if (bwLevel < (i - 1) * 100) continue;

        user.roles.add(bwLvLRoles[i - 1]);
        break;
      }

      // ? Skywars
      for (let i = swLvLRoles.length; i > 0; i--) {
        if (swLevel < (i - 1) * 10) continue;

        user.roles.add(swLvLRoles[i - 1]);
        break;
      }

      // ? Duels
      if (duelsWins >= 100) {
        for (let i = duelsRoles.length; i > 0; i--) {
          if (duelsWins < duelsWinsReqs[i - 1]) continue;

          user.roles.add(duelsRoles[i - 1]);
          break;
        }
      }

      // ? Skyblock
      if (skyblockLevel >= 1) {
        for (let i = skyblockRoles.length - 1; i > 0; i--) {
          if (skyblockLevel <= skyblockLvLReqs[i]) continue;

          user.roles.add(skyblockRoles[i]);
          break;
        }
      }

      const updateRole = new EmbedBuilder()
        .setColor(5763719)
        .setAuthor({ name: "Successfully completed" })
        .setDescription(`Roles have been successfully updated!`)
        .setFooter({
          text: `by DuckySoLucky#5181 | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      if (type === "verify") {
        updateRole.setDescription(`Your roles have been successfully updated!`);
        await interaction.followUp({ embeds: [updateRole], ephemeral: true });
      } else {
        await interaction.editReply({ embeds: [updateRole] });
      }
    } catch (error) {
      console.log(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by DuckySoLucky#5181 | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
