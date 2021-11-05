const cfg = require("../config.json");

const Discord = require("discord.js");
const Hypixel = require("hypixel-api-reborn");
const fs = require("fs");

/**
 * @param {Discord.Client} client 
 * @param {Hypixel.Client} hypixel 
 */
async function update(client, hypixel) {
    
    hypixel.getGuild("id", cfg.wristspasm_id).then(hyGuild => {

        const guild = client.guilds.cache.get(cfg.guild_id);

        try {
            fs.readFile("data/guild.json", (err, data) => {
                if (err) throw err;

                data = JSON.parse(data);

                let members = { members: [] };
                

                fs.writeFile("data/guild.json");

            });

        } catch(err) {
            await client.guilds.cache.get(cfg.guild_id).channels.cache.get(cfg.logs_channel_id).send(`Error while updating guild list: \`${err}\``);
            return;
        }

    }).catch(err => {
        await client.guilds.cache.get(cfg.guild_id).channels.cache.get(cfg.logs_channel_id).send(`Error while updating guild list: \`${err}\``);
        return;
    });

}

/**
 * @param {Discord.Client} client 
 * @param {Hypixel.Client} hypixel 
 */
async function guildChange(client, hypixel) {
    update(client, hypixel);
    setInterval(() => {
        update(client, hypixel);
    }, 3600000);
}

module.exports = guildChange;
