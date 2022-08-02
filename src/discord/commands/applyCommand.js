// Wrist Spasm Bot

const { getSenitherWeightUsername } = require('../../contracts/weight/senitherWeight')
const { toFixed, addCommas } = require('../../contracts/helperFunctions')
process.on('uncaughtException', function (err) {console.log(err.stack)})
const { getUsername } = require('../../contracts/API/PlayerDBAPI')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { SlashCommandBuilder } = require('@discordjs/builders')
const config = require ('../../../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
        .setName("apply")
        .setDescription("Request to join the guild"),

	async execute(interaction, client, member) {
        const linked = require('../../../data/discordLinked.json')
        try {
            await interaction.reply({content: `${client.user.username} is thinking...`, ephemeral: true });
            const uuid = linked?.[interaction?.user?.id]?.data[0]
            if (uuid) {
                const username = await getUsername(uuid)   
                hypixel.getPlayer(username).then(async player => {
                    let meetRequirements = false
                    const senither = await getSenitherWeightUsername(username)
                    const senitherW = senither.skills.weight + senither.skills.weight_overflow + senither.dungeons.weight + senither.dungeons.weight_overflow + senither.slayers.weight + senither.slayers.weight_overflow
                
                    if (config.guildRequirement.requirements.bedwarsStars > 0) if (player.stats.bedwars.level > config.guildRequirement.requirements.bedwarsStars) meetRequirements = true;
                    if (config.guildRequirement.requirements.skywars > 0) if (player.stats.skywars.level > config.guildRequirement.requirements.skywars) meetRequirements = true;
                    if (config.guildRequirement.requirements.senitherWeight > 0) if (senitherW > config.guildRequirement.requirements.senitherWeight) meetRequirements = true;
                    
                    if (meetRequirements) {
                        const applicationEmbed = new MessageEmbed()
                            .setColor('#00FF00')
                            .setAuthor({ name: 'Guild Application.'})
                            .setDescription(`Guild Application has been successfully sent to the guild staff.`)
                            .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                        interaction.editReply({content: `\u200B`, embeds: [ applicationEmbed ] })
        
                        const statsEmbed = new MessageEmbed()
                            .setColor(`${meetRequirements ? '#00FF00' : '#ff0000'}`)
                            .setTitle(`${player.nickname} has requested to join the Guild!`)
                            .setDescription(`**Hypixel Network Level**\n${player.level}\n`)
                            .addFields(
                                { name: 'Bedwars Level', value: `${player.stats.bedwars.level}`, inline: true },
                                { name: 'Skywars Level', value: `${ player.stats.skywars.level}`, inline: true },
                                { name: 'Senither Weight', value: `${addCommas(toFixed(senitherW, 0))}`, inline: true },
                            )
                            .setThumbnail(`https://www.mc-heads.net/avatar/${player.nickname}`) 
                            .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                        client.channels.cache.get(config.channels.joinRequests).send({ embeds: [statsEmbed] })

                    } else {
                        const errorEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setAuthor({ name: 'An Error has occurred!'})
                        .setDescription(`You do not meet requirements.`)
                        .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                    interaction.editReply({content: `\u200B`, embeds: [errorEmbed] });
                    }
                }).catch(err => {
                    console.log(err)
                    const errorEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setAuthor({ name: 'An Error has occurred!'})
                        .setDescription(`Something went wrong.. Please report to the staff.`)
                        .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                    interaction.editReply({content: `\u200B`, embeds: [errorEmbed] });
                });
                
            } else {
                const errorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'An Error has occurred'})
                    .setDescription(`You must link your account using `/verify` before using this command.`)
                    .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                interaction.reply({ embeds: [errorEmbed] });
            }
        } catch(error) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setAuthor({ name: 'An Error has occurred'})
                .setDescription(`You must link your account using `/verify` before using this command.`)
                .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
            interaction.reply({ embeds: [errorEmbed] });
        }
    }
}