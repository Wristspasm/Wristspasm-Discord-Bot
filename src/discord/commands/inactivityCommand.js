
const { getUsername } = require('../../contracts/API/PlayerDBAPI')
const immunity = require('../../../data/guildKickImmunity.json')
const hypixel = require('../../contracts/API/HypixelRebornAPI')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { toFixed } = require('../../contracts/helperFunctions')
const config = require ('../../../config.json')
const { MessageEmbed } = require('discord.js')
const { writeAt } = require("json-crate")

module.exports = {
	data: new SlashCommandBuilder()
    .setName("inactivity")
    .setDescription("Send an inactivity notice to the guild staff")
    .addStringOption(option => option.setName("reason").setDescription("Why are you going to be inactive?").setRequired(true))
    .addStringOption(option => option.setName("time").setDescription("How long will You be inactive for (in Days)").setRequired(true)),

     async execute(interaction, client) {
        const linked = require('../../../data/discordLinked.json')
        const reason = interaction.options.getString("reason");
        const time = interaction.options.getString("time")*86400

        if (uuid) {
        
            const expiration = (new Date().getTime()/1000 + time)

            await interaction.reply({content: `${client.user.username} is thinking...`, ephemeral: true });
            const uuid = linked?.[interaction?.user?.id]?.data[0]
            if (interaction.options.getString("time") > 14) {
                const username = await getUsername(uuid)
                hypixel.getGuild("id", config.minecraft.guildID).then(async guild => {
                    let found = false;
                    for (var i = 0; i < guild.members.length; i++) {
                        if (guild.members[i].uuid === uuid) {
                            found = true;
                            break;
                        }
                    }

                    if (found == undefined || found == false) {
                        const errorEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setAuthor({ name: 'You must be in the guild to use this command.'})
                            .setDescription(`${err}`)
                            .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                        interaction.editReply({content: `\u200B`,  embeds: [errorEmbed] });
                        return;
                    }

                    const inactivityEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setAuthor({ name: 'Inactivity request.'})
                        .setThumbnail(`https://www.mc-heads.net/avatar/${username}`) 
                        .setDescription(`\`Username:\` ${username}\n\`Requested:\` <t:${toFixed(new Date().getTime()/1000, 0)}>\n\`Expiration:\` <t:${toFixed(expiration, 0)}:R>\n\`Reason:\` ${reason}`)
                        .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                    client.channels.cache.get(`${config.channels.inactivity}`).send({ embeds: [inactivityEmbed] });

                    
                    await writeAt('data/guildKickImmunity.json', `${uuid}.data`, 
                        [
                            `${toFixed(expiration, 0)}`,
                            `${uuid}`,
                            `${username}`
                        ])

                    const inactivityResponse = new MessageEmbed()
                        .setColor('#00FF00')
                        .setAuthor({ name: 'Inactivity request.'})
                        .setDescription(`Inactivity request has been successfully sent to the guild stafff.`)
                        .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                    interaction.editReply({ content: `\u200B`, embeds: [ inactivityResponse ] });
                });
            } else {
                const errorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'An Error has occurred'})
                    .setDescription(`You cannot take break longer than 14 Days.`)
                    .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
                interaction.reply({ embeds: [errorEmbed] });
            }
        } else {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setAuthor({ name: 'An Error has occurred'})
                .setDescription(`You must link your account using `/verify` before using this command.`)
                .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' });
            interaction.reply({ embeds: [errorEmbed] });
        }
    }
}