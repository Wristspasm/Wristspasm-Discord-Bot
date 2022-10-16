const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getLatestProfile } = require('../../../API/functions/getLatestProfile')
const getWeight = require('../../../API/stats/weight')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hypixel = require("../../contracts/API/HypixelRebornAPI");
const { toFixed, addCommas } = require("../../contracts/helperFunctions");
const config = require("../../../config.json");
const Logger = require("../.././Logger");
const axios = require("axios");
const fs = require("fs");

const verifyEmbed = new EmbedBuilder()
  .setColor(15548997)
  .setAuthor({ name: "An Error has occurred" })
  .setDescription(
    `You must link your account using \`/verify\` before using this command.`
  )
  .setFooter({
    text: `by DuckySoLucky#5181 | /help [command] for more information`,
    iconURL: "https://imgur.com/tgwQJTX.png",
  });

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await interaction.deferReply({ ephemeral: false }).catch(() => {});

      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        Logger.discordMessage(`${interaction.user.username} - [${interaction.commandName}]`);
        bridgeChat = interaction.channelId;
        await command.execute(interaction, interaction.client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }

    if (interaction.isSelectMenu()) {
      // ? Guild Experience Filter
      if (interaction.values[0].includes("command.guildexpcheck.selectMenu")) {
        const value = interaction.values[0].split("_")[1] * 10000;
        const data = (await axios.get(interaction.message.attachments.first()?.url)).data;
        const guildMembers = data.split("\n");
        let newList = "";
        for (const member of guildMembers) {
          if (member.split(" » ")[1] < value) {
            newList += `${member}\n`;
          }
        }
        fs.writeFileSync("data/filteredExp.txt", `${newList}`);
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("guild.guildexpcheck.button.kick_inactive")
            .setLabel("Kick")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
          files: ["data/filteredExp.txt"],
          content: `**Filtered Weekly Guild Experience** (${value})`,
          components: [button],
        });
      }
    }
    if (interaction.isButton()) {
      try {
        const linked = require('../../../data/discordLinked.json')
        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        // ? Apply Button
        if (interaction.customId.includes("guild.apply_button")) {
          let meetRequirements = false
          const uuid = linked?.[interaction.user.id]?.data[0] ?? null
          if (!uuid) return interaction.followUp({ embeds: [verifyEmbed] });

          const [player, profile] = await Promise.all([
              hypixel.getPlayer(uuid),
              getLatestProfile(uuid)
          ])

          const weight = (await getWeight(profile.profile, profile.uuid)).weight.senither.total

          const bwLevel = player.stats.bedwars.level;
          const bwFKDR = player.stats.bedwars.finalKDRatio;

          const swLevel = player.stats.skywars.level/5;
          const swKDR = player.stats.skywars.KDRatio;
          
          const duelsWins = player.stats.duels.wins;
          const dWLR = player.stats.duels.WLRatio;

          if (weight > config.guildRequirement.requirements.senitherWeight) meetRequirements = true;

          if (bwLevel > config.guildRequirement.requirements.bedwarsStars) meetRequirements = true;
          if (bwLevel > config.guildRequirement.requirements.bedwarsStarsWithFKDR && bwFKDR > config.guildRequirement.requirements.bedwarsFKDR) meetRequirements = true;

          if (swLevel > config.guildRequirement.requirements.skywarsStars) meetRequirements = true;
          if (swLevel > config.guildRequirement.requirements.skywarsStarsWithKDR && swKDR > config.guildRequirement.requirements.skywarsStarsWithKDR) meetRequirements = true;

          if (duelsWins > config.guildRequirement.requirements.duelsWins) meetRequirements = true;
          if (duelsWins > config.guildRequirement.requirements.duelsWinsWithWLR && dWLR > config.guildRequirement.requirements.duelsWinsWithWLR) meetRequirements = true;

          if (meetRequirements) {
              const applicationEmbed = new EmbedBuilder()
                  .setColor(2067276)
                  .setAuthor({ name: 'Guild Application.'})
                  .setDescription(`Guild Application has been successfully sent to the guild staff.`)
                  .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });
              interaction.followUp({ embeds: [applicationEmbed] })

              const statsEmbed = new EmbedBuilder()
                  .setColor(2067276)
                  .setTitle(`${player.nickname} has requested to join the Guild!`)
                  .setDescription(`**Hypixel Network Level**\n${player.level}\n`)
                  .addFields(
                      { name: 'Bedwars Level', value: `${player.stats.bedwars.level}`, inline: true },
                      { name: 'Skywars Level', value: `${player.stats.skywars.level}`, inline: true },
                      { name: 'Duels Wins', value: `${player.stats.duels.wins}`, inline: true },
                      { name: 'Bedwars FKDR', value: `${player.stats.bedwars.finalKDRatio}`, inline: true },
                      { name: 'Skywars KDR', value: `${player.stats.skywars.KDRatio}`, inline: true },
                      { name: 'Duels WLR', value: `${player.stats.duels.KDRatio}`, inline: true },
                      { name: 'Senither Weight', value: `${addCommas(toFixed((weight), 2))}`, inline: true },
                  )
                  .setThumbnail(`https://www.mc-heads.net/avatar/${player.nickname}`) 
                  .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });
              client.channels.cache.get(config.channels.joinRequests).send({ embeds: [statsEmbed] })

          } else {
              const errorEmbed = new EmbedBuilder()
                  .setColor(15548997)
                  .setAuthor({ name: 'An Error has occurred!'})
                  .setDescription(`You do not meet requirements.`)
                  .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });
              interaction.followUp({ embeds: [errorEmbed] });
          }
        }

        // ? /gexpcheck command
        if (
          interaction.customId.includes("guild.guildexpcheck.button.kick_inactive")) {
          if ((await interaction.guild.members.fetch(interaction.user)).roles.cache.has(config.discord.commandRole)) {
            const data = (await axios.get(interaction.message.attachments.first()?.url)).data;
            const guildMembers = data.split("\n");
            let kicked = "", i = 0;
            await interaction.reply({ content: "**Kick Purge Started**" });
            for (const member of guildMembers) {
              //bot.chat(`/g kick ${member.split(' » ')[0]} Not enough Guild Experience Collected`)
              await delay(690);
              i++;
              member.split(" » ")[0] == ""
                ? ""
                : (kicked +=
                    i % 5 == 0
                      ? `${member.split(" » ")[0]}\n`
                      : `${member.split(" » ")[0]} | `);
              if (toFixed((i / guildMembers.length) * 100, 0).endsWith("0") || toFixed((i / guildMembers.length) * 100, 0).endsWith("5")) {
                await interaction.editReply({
                  content: `**Kick Purge Started**\n\`Progress:\` ${toFixed((i / guildMembers.length) * 100, 2)}%`,
                });
              }
            }
            kicked = kicked.slice(0, -3);
            await interaction.followUp({
              content: `**Kicked Members**\n\`${kicked}\``,
            });
          } else {
            const errorEmbed = new EmbedBuilder()
              .setColor(15548997)
              .setAuthor({ name: "An Error has occurred" })
              .setDescription(`You do not have permission to run this command.`)
              .setFooter({
                text: `by DuckySoLucky#5181 | /help [command] for more information`,
                iconURL: "https://imgur.com/tgwQJTX.png",
              });
            interaction.followUp({ embeds: [errorEmbed] });
          }
        }
      } catch (error) {
        console.log(error);
        const errorEmbed = new EmbedBuilder()
          .setColor(15548997)
          .setAuthor({ name: "An Error has occurred" })
          .setDescription(error)
          .setFooter({
            text: `by DuckySoLucky#5181 | /help [command] for more information`,
            iconURL: "https://imgur.com/tgwQJTX.png",
          });
        interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
