const { getLatestProfile } = require('../../../API/functions/getLatestProfile')
const { toFixed, addCommas, formatNumber } = require('../../contracts/helperFunctions')
const hypixelRebornAPI = require('../../contracts/API/HypixelRebornAPI')
const getWeight = require('../../../API/stats/weight')
const config = require ('../../../config.json')
const { EmbedBuilder } = require("discord.js")
const fs = require('fs')

module.exports = {
    name: 'apply',
    description: 'Request to join the guild.',
  
    execute: async (interaction) => {
        try {
            const linked = JSON.parse(fs.readFileSync('data/discordLinked.json', 'utf8'));

            if (linked === undefined) throw new Error('No verification data found. Please contact an administrator.')

            const uuid = linked[interaction.user.id];

            if (uuid === undefined) throw new Error("You are no verified. Please verify using /verify.")

            const [player, { profile }] = await Promise.all([
                hypixelRebornAPI.getPlayer(uuid, { guild: true }),
                getLatestProfile(uuid)
            ])

            const bwLevel = player.stats.bedwars.level;
            const skyblockLevel = ((profile?.leveling?.experience || 0) / 100) ?? 0;

            let meetRequirements = false;
            if (skyblockLevel > config.minecraft.guildRequirements.requirements.skyblockLevel || bwLevel > config.minecraft.guildRequirements.requirements.bedwarsStars) {
                meetRequirements = true;
            }

            /*
            const weight = getWeight(profile.profile, profile.uuid)?.weight?.senither?.total || 0;
            const bwFKDR = player.stats.bedwars.finalKDRatio;

            const swLevel = player.stats.skywars.level/5;
            const swKDR = player.stats.skywars.KDRatio;
        
            const duelsWins = player.stats.duels.wins;
            const dWLR = player.stats.duels.WLRatio;

            if (weight > config.minecraft.guildRequirements.requirements.senitherWeight) meetRequirements = true;

            if (bwLevel > config.minecraft.guildRequirements.requirements.bedwarsStarsWithFKDR && bwFKDR > config.minecraft.guildRequirements.requirements.bedwarsFKDR) meetRequirements = true;
    
            if (swLevel > config.minecraft.guildRequirements.requirements.skywarsStars) meetRequirements = true;
            if (swLevel > config.minecraft.guildRequirements.requirements.skywarsStarsWithKDR && swKDR > config.minecraft.guildRequirements.requirements.skywarsStarsWithKDR) meetRequirements = true;
    
            if (duelsWins > config.minecraft.guildRequirements.requirements.duelsWins) meetRequirements = true;
            if (duelsWins > config.minecraft.guildRequirements.requirements.duelsWinsWithWLR && dWLR > config.minecraft.guildRequirements.requirements.duelsWinsWithWLR) meetRequirements = true;
            */

            if (meetRequirements === false) {
                throw new Error(`You do not meet the requirements to join the guild. Please try again once you meet the requirements.`);
            } 

            const applicationEmbed = new EmbedBuilder()
                .setColor(2067276)
                .setAuthor({ name: 'Guild Application.'})
                .setDescription(`Guild Application has been successfully sent to the guild staff.`)
                .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });
            await interaction.followUp({ embeds: [applicationEmbed] })


            let description = "";
            for (const socialMedia of player.socialMedia) {
                description += `**${socialMedia.name}**: \`${socialMedia.link}\`\n`
            }

            const fields = [];
            fields.push({ name: 'Rank', value: `\`${player.rank ?? "None"}\``, inline: true })
            fields.push({ name: 'Guild', value: `[${player.guild?.name ?? "None"}](https://plancke.io/hypixel/guild/name/${player.guild.name.replaceAll(" ", "%20")})`, inline: true })
            fields.push({ name: 'Level', value: `\`${player.level}\``, inline: true })
            fields.push({ name: 'First Login', value: `<t:${Math.floor(player.firstLogin / 1000)}:R>`, inline: true })
            fields.push({ name: 'Last Seen', value: `<t:${Math.floor(player.lastLogin / 1000)}:R>`, inline: true })
            fields.push({ name: 'Karma', value: `\`${player.karma.toLocaleString()}\``, inline: true })
            fields.push({ name: 'Skyblock LvL', value: `\`${skyblockLevel}\``, inline: true })
            fields.push({ name: 'Bedwars Lvl', value: `\`${bwLevel}\``, inline: true })
            fields.push({ name: 'SkyCrypt', value: `[Click](https://sky.shiiyu.moe/stats/${player.nickname})`, inline: true })
            

            const statsEmbed = new EmbedBuilder()
                .setColor(2067276)
                .setTitle(`${player.nickname}`)
                .setURL(`https://plancke.io/hypixel/player/stats/${player.uuid}`)
                .setThumbnail(`https://visage.surgeplay.com/full/512/${player.uuid}.png`) 
                .setFields(fields)    
                .setDescription(`${description}`)
                .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });

            interaction.client.channels.cache.get(config.discord.channels.joinRequests).send({ embeds: [statsEmbed] })
            
          } catch (error) {
            console.log(error)

            const errorEmbed = new EmbedBuilder()
              .setColor(15548997)
              .setAuthor({ name: 'An Error has occurred'})
              .setDescription(`\`\`\`${error.toString().replaceAll("[hypixel-api-reborn] ", "")}\`\`\``)
              .setFooter({ text: `by DuckySoLucky#5181 | /help [command] for more information`, iconURL: 'https://imgur.com/tgwQJTX.png' });
              
            interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
          }
    },
}