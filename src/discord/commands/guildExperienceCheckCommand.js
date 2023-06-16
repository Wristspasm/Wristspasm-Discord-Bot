const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const hypixelRebornAPI = require("../../contracts/API/HypixelRebornAPI");
const { getUsername } = require("../../contracts/API/PlayerDBAPI");
const { StringSelectMenuBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

module.exports = {
  name: "gexpcheck",
  description: "Shows every play that got less than required amount of GEXP in the last 7 days",

  execute: async (interaction) => {
    try {
      const collector = interaction.channel.createMessageComponentCollector({
        compnentType: "DROPDOWN",
        time: 60 * 1000, // 60 seconds
      });

      if (interaction.member.permissions.has("ADMINISTRATOR") === false) {
        throw new Error("You don't have permission to use this command.");
      }

      const inactivity = JSON.parse(fs.readFileSync("data/inactivity.json", "utf8"));
      if (inactivity === undefined) {
        throw new Error("No inactivity data found. Please contact an administrator.");
      }

      const { members } = await hypixelRebornAPI.getGuild("name", "WristSpasm");
      if (members === undefined) {
        throw new Error("Failed to fetch guild data. Please contact an administrator.");
      }

      const embed = new EmbedBuilder()
        .setColor(5763719)
        .setTitle("Weekly Guild Experience Leaderboard")
        .setDescription("This may take a while, please wait...")
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [embed] });

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

          const unix = Math.floor(inactivity[member.uuid]?.expiration / 1000);
          const reason = inactivity[member.uuid]?.reason ?? "None";
          skippedPlayers += `- \`${username}\` » Reason: \`${reason}\` (<t:${unix}:R>)\n`;
          continue;
        }

        string += `${username} » ${member.weeklyExperience.toLocaleString()}\n`;

        const position = members.findIndex((element) => element.uuid === member.uuid);
        const progress = ((position / members.length) * 100).toFixed(2);

        if (position % 10 === 0) {
          const progressEmbed = new EmbedBuilder()
            .setColor(5763719)
            .setAuthor({ name: "Weekly Guild Experience Leaderboard" })
            .setDescription(
              `This may take a while, please wait...\n**Progress:** \`${progress}%\` (\`${position}/${members.length}\`)`
            )
            .setFooter({
              text: `by @duckysolucky | /help [command] for more information`,
              iconURL: "https://imgur.com/tgwQJTX.png",
            });

          await interaction.editReply({ embeds: [progressEmbed] });
        }
      }

      // Sort members from highest to lowest weekly experience
      string = string
        .split("\n")
        .sort((a, b) => {
          const aa = parseInt(a.split(" » ")[1]?.replace(",", "")) ?? 0;
          const bb = parseInt(b.split(" » ")[1]?.replace(",", "")) ?? 0;

          return bb - aa;
        })
        .join("\n");
      fs.writeFileSync("data/guildExperience.txt", string);

      embed.setDescription(`**Skipped players:**\n${skippedPlayers}`);

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

      await interaction.editReply({
        embeds: [embed],
        files: ["data/guildExperience.txt"],
        components: [new ActionRowBuilder().addComponents(dropdownMenu)],
      });
      collector.resetTimer();

      collector.on("collect", async (i) => {
        collector.resetTimer();

        if (i.customId === "select") {
          const guildExp = parseInt(i.values[0].split(".")[2]);
          if (guildExp === NaN) {
            throw new Error("Failed to parse guild experience. Please contact an administrator.");
          }

          const guildExpFile = fs.readFileSync("data/guildExperience.txt", "utf8");
          if (guildExpFile === undefined) {
            throw new Error("Failed to read guild experience file. Please contact an administrator.");
          }

          let string = "";
          for (const line of guildExpFile.split("\n")) {
            if (parseInt(line.split(" » ")[1]?.replace(",", "") ?? 0) > guildExp) continue;

            string += `${line}\n`;
          }

          dropdownMenu.setPlaceholder(guildExp.toLocaleString());

          if (i.replied === false) {
            return await i.reply({
              files: [{ attachment: Buffer.from(string), name: "guildExperience.txt" }],
              content: `**Weekly Guild Experience** (${guildExp.toLocaleString()})`,
              ephemeral: true,
            });
          }

          await i.followUp({
            files: [{ attachment: Buffer.from(string), name: "guildExperience.txt" }],
            content: `**Weekly Guild Experience** (${guildExp.toLocaleString()})`,
            ephemeral: true,
          });
        }

        if (i.customId === "kick") {
          const guildExp = parseInt(i.message.components[0].components[0].placeholder.replace(",", ""));
          if (guildExp === NaN) {
            throw new Error("Failed to parse guild experience. Please contact an administrator.");
          }

          const guildExpFile = fs.readFileSync("data/guildExperience.txt", "utf8");
          if (guildExpFile === undefined) {
            throw new Error("Failed to read guild experience file. Please contact an administrator.");
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
    } catch (error) {
      console.log(error);
      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(
          `\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "").replaceAll("Error: ", "")}\`\`\``
        )
        .setFooter({
          text: `by @duckysolucky | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
