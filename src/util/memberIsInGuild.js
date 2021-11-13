const cfg = require("../../config.json");
const Hypixel = require("hypixel-api-reborn");

/**
 * @param {string} uuid 
 * @param {Hypixel.Client} hypixel 
 */
function memberIsInGuild(uuid, hypixel) {

    hypixel.getGuild("id", cfg.wristspasm_id).then(guild => {
        for (var i = 0; i < guild.members.length; i++) {
            if (guild.members[i].uuid === uuid) {
                return true
            }
        }
    });

    return false;
}

module.exports = memberIsInGuild;
