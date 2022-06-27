const config = require("../../config.json");
const hypixel = require('../handlers/Hypixel')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require("fs");
process.on('uncaughtException', function (err) {console.log(err.stack);});


module.exports = {
	data: new SlashCommandBuilder()
    .setName("inactive")
    .setDescription("Send an inactivity notice to the guild staff")
    .addStringOption(option => option.setName("reason").setDescription("Why are you going to be inactive?").setRequired(true))
    .addStringOption(option => option.setName("time").setDescription("How long you'll be inactive for").setRequired(true)),

     async execute(interaction, client) {
        const reason = interaction.options.getString("reason");
        const time = interaction.options.getString("time");

        hypixel.getGuild("id", config.minecraft.guild_id).then(hyGuild => {
            fs.readFile(`data/${interaction.user.id}`, (err, data) => {
                if (err) {
                    const errorEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setAuthor({ name: 'You must link your account using `/verify` before using this command.'})
                        .setDescription(`${err}`)
                        .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                    interaction.reply({ embeds: [errorEmbed] });
                    return;
                }

                hypixel.getPlayer(`${data}`).then(player => {
                    let found = false;
                    for (var i = 0; i < hyGuild.members.length; i++) {
                        if (hyGuild.members[i].uuid === player.uuid) {
                            found = true;
                            break;
                        }
                    }

                    if (found == undefined || found == false) {
                        const errorEmbed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setAuthor({ name: 'You must be in the guild to use this command.'})
                            .setDescription(`${err}`)
                            .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                        interaction.reply({ embeds: [errorEmbed] });
                        return;
                    }

                    const inactivityEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setAuthor({ name: 'Inactivity request.'})
                        .setThumbnail(`https://www.mc-heads.net/avatar/${player.nickname}`) 
                        .setDescription(`Inactivity request\nIGN: \`${player.nickname}\`\nRequested at \`${new Date(Date.now()).toUTCString()}\`\nReason: \`${reason}\`\nRequested Time: \`${time}\``)
                        .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                    
                    
                    client.channels.cache.get(`${config.channels.inactivity}`).send({ embeds: [inactivityEmbed] });

                    const newEmbed = new MessageEmbed()
                        .setColor('#00FF00')
                        .setAuthor({ name: 'Inactivity request.'})
                        .setThumbnail(`https://www.mc-heads.net/avatar/${player.nickname}`) 
                        .setDescription(`Inactivity request has been successfully sent to the guild stafff.`)
                        .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                    interaction.reply({ embeds: [newEmbed] });

                }).catch(err => {
                    console.log(err)
                    const errorEmbed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setAuthor({ name: 'You must be in the guild to use this command.'})
                        .setDescription(`${err}`)
                        .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                    interaction.reply({ embeds: [errorEmbed] });
                });
            });
        
        });
    }
}