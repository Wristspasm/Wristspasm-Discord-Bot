const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Interaction, Client } = require('discord.js');
const fs = require("fs");
const axios = require('axios');
const config = require("../../config.json");
process.on('uncaughtException', function (err) {console.log(err.stack);});

function addNotation(type, value) {
    let returnVal = value;
    let notList = [];
    if (type === "shortScale") {
        notList = [
            " Thousand",
            " Million",
            " Billion",
            " Trillion",
            " Quadrillion",
            " Quintillion"
        ];
    }

    if (type === "oneLetters") {
        notList = ["K", "M", "B", "T"];
    }

    let checkNum = 1000;

    if (type !== "none" && type !== "commas") {
        let notValue = notList[notList.length - 1];
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift();
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100);
                    returnVal = Math.floor(returnVal);
                    returnVal = (returnVal / Math.pow(10, o)) * 10;
                    returnVal = +returnVal.toFixed(o - 1) + notValue;
                }
                checkNum *= 10;
            }
        }
    } else {
        returnVal = numberWithCommas(value.toFixed(0));
    }
    return `${returnVal}`;
}

const permissionEmbed = new MessageEmbed()
    .setColor('#ff0000')
    .setAuthor({ name: 'An Error has occured!'})
    .setDescription(`You do not have permission to use this command!`)
    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });

module.exports = {
	data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("(Admin Command) Change the API key")
    .addStringOption(option => option.setName("name").setDescription("Username").setRequired(true)),

    async execute(interaction, client, member) {
        const name = interaction.options.getString("name");

        axios({
            method: 'get',
            url: `https://playerdb.co/api/player/minecraft/${name}`
        }).then(function (response) {
            const uuid = response.data.data.player.id
            axios({
                method: 'get',
                url: `http://localhost:3000/v1/profiles/${name}?key=DuckySoLucky`
            }).then(function (response) {
                const profile = response.data.data[0].name
                const lastSave = response.data.data[0].last_save
                const ironman = response.data.data[0].isIronman
                const skillAverage = (response.data.data[0].skills.farming.level + response.data.data[0].skills.mining.level + response.data.data[0].skills.combat.level + response.data.data[0].skills.foraging.level + response.data.data[0].skills.fishing.level + response.data.data[0].skills.enchanting.level + response.data.data[0].skills.alchemy.level + response.data.data[0].skills.taming.level) / 8
                const catacombsLevel = response.data.data[0].dungeons.catacombs.skill.level
                const senitherWeight = response.data.data[0].weight.total_weight_with_overflow
                const networth = response.data.data[0].networth.total_networth
                const bank = response.data.data[0].networth.bank
                const purse = response.data.data[0].networth.purse
                const slayer = `${response.data.data[0].slayer.zombie.level} ${response.data.data[0].slayer.spider.level} ${response.data.data[0].slayer.wolf.level} ${response.data.data[0].slayer.enderman.level} ${response.data.data[0].slayer.blaze.level}`
                const fairySouls = response.data.data[0].fairy_souls
                const minionSlots = response.data.data[0].minions.minionSlots
                let type = 'Unknown'
                if (ironman == false) {
                    type = 'Normal'
                } else {
                    type = 'Ironman'
                }
                const profileData = new MessageEmbed()
                    .setColor("#ffff55")
                    .setTitle(`${name}'s ${profile} Profile`)
                    .setURL(`https://sky.shiiyu.moe/stats/${name}`)
                    .setDescription(`Profile: **${profile}**\nLast Save: **${lastSave < 3715200000 ? "Unknown" : new Date(lastSave).toUTCString()}**\nType: **${type}**\n \n \n`)
                    .setThumbnail(`https://visage.surgeplay.com/full/${uuid}`) 
                    .addFields(
                        { name: '**Skill Average**', value: `${Math.round(skillAverage*100)/100}`, inline: true },
                        { name: '**Catacombs**', value: `${catacombsLevel}`, inline: true },
                        { name: '**Senither Weight**', value: `${Math.round(senitherWeight*100)/100}`, inline: true },
    
                        { name: '**Networth**', value: addNotation("oneLetters", networth), inline: true},
                        { name: '**Bank**', value: addNotation("oneLetters", bank), inline: true},
                        { name: '**Purse**', value: addNotation("oneLetters", purse), inline: true},
    
                        { name: '**Slayers**', value: `${slayer}`, inline: true},
                        { name: '**Fairy Souls**', value: `${fairySouls}`, inline: true},
                        { name: '**Minion Slots**', value: `${minionSlots}`, inline: true},
                    )
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                    interaction.reply({ embeds: [profileData] })
                
            }).catch((error)=>{console.log(error);});       
        }).catch((error)=>{console.log(error);});
    }
}