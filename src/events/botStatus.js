const config = require("../../config.json");
const hypixel = require('../handlers/Hypixel');
const { Client } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
function botStatus(client) {
    setInterval(() => {
        client.user.setActivity("/g join WristSpasm", { type: "PLAYING" });
    }, 10000);
}

module.exports = botStatus;
