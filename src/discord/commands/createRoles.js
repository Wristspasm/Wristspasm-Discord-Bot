const WristSpasmError = require("../../contracts/errorHandler.js");
const fs = require("fs");

const DISABLED = true;

module.exports = {
  name: "create-roles",
  description: "Revert skyblock roles",
  moderatorOnly: true,
  defer: true,

  execute: async (interaction) => {
    if (DISABLED) {
      throw new WristSpasmError("Command is disabled");
    }

    const roles = fs.readFileSync("roles.json", "utf-8");
    if (roles === undefined) {
      throw new WristSpasmError("No roles found");
    }

    const rolesParsed = JSON.parse(roles);
    if (rolesParsed === undefined) {
      throw new WristSpasmError("No roles found");
    }

    const skyblockRoles = rolesParsed.filter((role) => role.name.includes("[") && role.name.includes("]"));
    if (skyblockRoles === undefined || skyblockRoles.length === 0) {
      throw new WristSpasmError("No skyblock roles found");
    }

    const guild = interaction.guild;
    if (guild === undefined) {
      throw new WristSpasmError("No guild found");
    }

    const guildRoles = await guild.roles.fetch();
    if (guildRoles === undefined) {
      throw new WristSpasmError("No roles found");
    }

    skyblockRoles.forEach(async (role) => {
      await guild.roles.create({
        name: role.name,
        color: role.color,
        position: role.data.rawPosition,
        mentionable: role.data.mentionable
      });
    });

    await interaction.editReply("Skyblock roles created");
  }
};
