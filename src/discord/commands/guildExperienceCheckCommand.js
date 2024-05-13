const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI.js");
const { getUsername } = require("../../contracts/API/mowojangAPI.js");
const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");
const WristSpasmError = require("../../contracts/errorHandler.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "gexpcheck",
  description: "Shows every play that got less than required amount of GEXP in the last 7 days",
  moderatorOnly: true,

  execute: async (interaction) => {
    const collector = interaction.channel.createMessageComponentCollector({
      compnentType: "DROPDOWN",
      time: 60 * 1000,
    });

    const inactivity = JSON.parse(fs.readFileSync("data/inactivity.json", "utf8"));
    if (inactivity === undefined) {
      throw new WristSpasmError("No inactivity data found. Please contact an administrator.");
    }

    const { members } = await hypixelRebornAPI.getGuild("name", "WristSpasm");
    if (members === undefined) {
      throw new WristSpasmError("Failed to fetch guild data. Please contact an administrator.");
    }

    let string = "",
      skippedPlayers = "";
    for (const member of members) {
      const joinedInLast7Days = new Date(member.joinedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
      const inactivityExpired = inactivity[member.uuid]?.expiration > Math.floor(Date.now() / 1000);
      const username = await getUsername(member.uuid);

      if (joinedInLast7Days === true || inactivityExpired === true) {
        if (joinedInLast7Days === true) {
          const unix = Math.floor(new Date(member.joinedAt).getTime() / 1000);
          skippedPlayers += `- \`${username}\` » Joined: <t:${unix}:R>\n`;
          continue;
        }

        const unix = inactivity[member.uuid]?.expiration;
        const reason = inactivity[member.uuid]?.reason ?? "None";
        skippedPlayers += `- \`${username}\` » Reason: \`${reason}\` (<t:${unix}:R>)\n`;
        continue;
      }

      string += `${username} » ${member.weeklyExperience.toLocaleString()}\n`;

      const position = members.indexOf(member) + 1;
      const progress = ((position / members.length) * 100).toFixed(2);

      const progressEmbed = new EmbedBuilder()
        .setColor(5763719)
        .setAuthor({ name: "Weekly Guild Experience Leaderboard" })
        .setDescription(`**Progress:** \`${progress}%\` (\`${position}/${members.length}\`)`)
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      interaction.editReply({ embeds: [progressEmbed] });
    }

    string = string
      .split("\n")
      .sort((a, b) => {
        const n1 = parseInt(a.split(" » ")[1]?.replace(",", ""));
        const n2 = parseInt(b.split(" » ")[1]?.replace(",", ""));

        return (n2 ?? 0) - (n1 ?? 0);
      })
      .join("\n");
    fs.writeFileSync("data/guildExperience.txt", string);

    const embed = new EmbedBuilder()
      .setColor(5763719)
      .setTitle("Weekly Guild Experience Leaderboard")
      .setDescription(`**Skipped players:**\n${skippedPlayers}`)
      .setFooter({
        text: `by @duckysolucky | /help [command] for more information`,
        iconURL: "https://imgur.com/tgwQJTX.png",
      });

    const dropdownMenu = new StringSelectMenuBuilder()
      .setCustomId("select")
      .setPlaceholder("No Filter")
      .addOptions(
        {
          label: "10,000",
          description: "Show everyone below 10,000 Guild Experience",
          value: "command.guildexpcheck.10000",
        },
        {
          label: "20,000",
          description: "Show everyone below 20,000 Guild Experience",
          value: "command.guildexpcheck.20000",
        },
        {
          label: "30,000",
          description: "Show everyone below 30,000 Guild Experience",
          value: "command.guildexpcheck.30000",
        },
        {
          label: "40,000",
          description: "Show everyone below 40,000 Guild Experience",
          value: "command.guildexpcheck.40000",
        },
        {
          label: `${config.minecraft.guild.guildExp.toLocaleString()}`,
          description: `Show everyone below ${config.minecraft.guild.guildExp.toLocaleString()} Guild Experience`,
          value: `command.guildexpcheck.${config.minecraft.guild.guildExp}`,
        }
      );

    collector.resetTimer();
    await interaction.editReply({
      embeds: [embed],
      files: ["data/guildExperience.txt"],
      components: [new ActionRowBuilder().addComponents(dropdownMenu)],
    });

    collector.on("collect", async (i) => {
      collector.resetTimer();

      if (i.customId === "select") {
        const guildExp = parseInt(i.values[0].split(".")[2]);
        if (isNaN(guildExp) === true) {
          throw new WristSpasmError("Failed to parse guild experience. Please contact an administrator.");
        }

        const guildExpFile = fs.readFileSync("data/guildExperience.txt", "utf8");
        if (guildExpFile === undefined) {
          throw new WristSpasmError("Failed to read guild experience file. Please contact an administrator.");
        }

        const string = guildExpFile
          .split("\n")
          .map((line) => {
            const experience = parseInt(line.split(" » ")[1]?.replace(",", ""));

            if (experience <= guildExp) {
              return line;
            }
          })
          .filter((line) => line)
          .join("\n");

        dropdownMenu.setPlaceholder(guildExp.toLocaleString());
        const output = {
          files: [{ attachment: Buffer.from(string), name: "guildExperience.txt" }],
          content: `**Weekly Guild Experience** (${guildExp.toLocaleString()})`,
          ephemeral: true,
        };

        if (i.replied === false) {
          return await i.reply(output);
        } else {
          return await i.followUp(output);
        }
      }

      if (i.customId === "kick") {
        const guildExp = parseInt(i.message.components[0].components[0].placeholder.replace(",", ""));
        if (isNaN(guildExp) === true) {
          throw new WristSpasmError("Failed to parse guild experience. Please contact an administrator.");
        }

        const guildExpFile = fs.readFileSync("data/guildExperience.txt", "utf8");
        if (guildExpFile === undefined) {
          throw new WristSpasmError("Failed to read guild experience file. Please contact an administrator.");
        }

        let string = "";
        for (const line of guildExpFile.split("\n")) {
          if (line.split(" » ")[1] > guildExp) continue;

          string += `\`/g kick ${line.split(" » ")[0]}\`\n`;
        }

        const responseEmbed = new EmbedBuilder()
          .setColor(5763719)
          .setAuthor({ name: "Guild Experience Kick Command" })
          .setDescription(`**Weekly Guild Experience** (${guildExp.toLocaleString()})\n\n${string}`)
          .setFooter({
            text: `by @duckysolucky | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });

        await i.update({ embeds: [responseEmbed], files: [], content: "", components: [] });
      }
    });

    collector.on("end", () => {
      interaction.editReply({
        components: [],
      });
    });
  },
};
