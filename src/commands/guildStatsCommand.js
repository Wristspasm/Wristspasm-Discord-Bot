const config = require("../../config.json");
const hypixel = require('../handlers/Hypixel')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
        .setName("guild")
        .setDescription("Shows information of guild"),

     async execute(interaction, client) {
        hypixel.getGuild("id", config.minecraft.guild_id).then(guild => {
            const embed = new MessageEmbed()
                .setColor("#ffff55")
                .setThumbnail(`https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096`) 
                .setTitle("Wristspasm Guild Stats")
                .addField("Level", `${guild.level}`)
                .addField("GEXP", `${guild.experience}`)
                .addField("Member Count", `${guild.members.length}`)
                .addField("Weekly GEXP", `${guild.totalWeeklyGexp}`)
                .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
            interaction.reply({ embeds: [ embed ] });

        }).catch(err => {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setAuthor({ name: 'An Error has occured!'})
                .setDescription(`${err}`)
                .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
            interaction.reply({ embeds: [errorEmbed] });
        })
    }
}
