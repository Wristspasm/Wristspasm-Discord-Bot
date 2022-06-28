const config = require("../../config.json");
const hypixel = require('../handlers/Hypixel')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require("fs");
const axios = require('axios');
process.on('uncaughtException', function (err) {console.log(err.stack);});

const permissionEmbed = new MessageEmbed()
    .setColor('#ff0000')
    .setAuthor({ name: 'An Error has occured!'})
    .setDescription(`You do not have permission to use this command!`)
    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });


module.exports = {
	data: new SlashCommandBuilder()
        .setName("gexpcheck")
        .setDescription("(Admin Command) Shows everyone that got less than 50k GEXP in the last 7 days"),

     async execute(interaction, client) {
        if (!interaction.memberPermissions.has("ADMINISTRATOR")  && !interaction.member.roles.includes(interaction.guild.roles.cache.get(config.admin_role_id)) && interaction.member.user.id != config.member_ids.calculus && interaction.member.user.id != config.member_ids.ducky) {
			interaction.reply({ embeds: [permissionEmbed] });
            return;
        }
        hypixel.getGuild("id", config.minecraft.guild_id).then(guild => {
                let expStr = "";
                for (const member of guild.members) {
                    if (member.weeklyExperience < 50000 && member.joinedAtTimestamp < Date.now() - (7*24*60*60*1000)) {
                        axios({
                            method: 'get',
                            url: `https://api.hypixel.net/player?key=${config.minecraft.apiKey}&uuid=${member.uuid}`
                        }).then(function (response) {
                            expStr += `${response.data.player.displayname} » ${member.weeklyExperience}\n`;
                            fs.writeFile("data/exp.txt", `${expStr}`);
                        }).catch(()=>{});
                    }                  
                }
                interaction.reply({ files: [ "data/exp.txt" ], content: "**Weekly Guild Experience**" });

        }).catch(err => {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setAuthor({ name: 'An Error has occured!'})
                .setDescription(`${err}`)
                .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
            interaction.reply({ embeds: [errorEmbed] });
        });
    }
}
