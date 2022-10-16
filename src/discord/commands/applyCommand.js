const { toFixed, addCommas } = require('../../contracts/helperFunctions')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const config = require ('../../../config.json')
const { EmbedBuilder } = require("discord.js")
const { getLatestProfile } = require('../../../API/functions/getLatestProfile')
const getWeight = require('../../../API/stats/weight')

const verifyEmbed = new EmbedBuilder()
    .setColor(15548997)
    .setAuthor({ name: 'An Error has occurred'})
    .setDescription(`You must link your account using \`/verify\` before using this command.`)
    .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });

module.exports = {
    name: 'apply',
    description: 'Request to join the guild.',
  
    execute: async (interaction, client) => {
        const linked = require('../../../data/discordLinked.json')
        try {
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
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(15548997)
                .setAuthor({ name: 'An Error has occurred'})
                .setDescription(error)
                .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });
            interaction.followUp({ embeds: [errorEmbed] });
        }
    },
}