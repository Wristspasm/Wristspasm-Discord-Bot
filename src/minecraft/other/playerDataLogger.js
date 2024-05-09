const { getUUID } = require("../../contracts/API/mowojangAPI.js");
const fs = require("fs");

const DEFAULT_DATA = {
  username: null,
  joined: 0,
  lastLogin: null,
  left: 0,
  lastLogout: null,
  online: false,
  playtime: 0,
  messages: 0,
};

if (typeof bot === "undefined") {
  setTimeout(() => {
    bot.on("message", async (message) => {
      try {
        message = message.toString();
        if (message.startsWith("Guild >")) {
          const playerData = JSON.parse(fs.readFileSync("data/playerData.json"));

          if (message.includes(":")) {
            const [group] = message.split(":").map((s) => s.trim());
            const hasRank = group.endsWith("]");
            const userParts = group.split(" ");
            const username = userParts[userParts.length - (hasRank ? 2 : 1)];

            const uuid = await getUUID(username);
            playerData[uuid] ??= DEFAULT_DATA;
            playerData[uuid].username = username;
            playerData[uuid].messages++;
          }

          if (message.includes("left") || message.includes("joined.")) {
            const action = message.split(" ")[3].slice(0, -1);
            const username = message.split(" ")[2];
            const uuid = await getUUID(username);
            playerData[uuid] ??= DEFAULT_DATA;

            playerData[uuid].username = username;
            if (action === "joined") {
              playerData[uuid].joined++;
              playerData[uuid].lastLogin = Date.now();
              playerData[uuid].online = true;
            } else if (action === "left") {
              playerData[uuid].left++;
              playerData[uuid].lastLogout = Date.now();
              playerData[uuid].online = false;

              if (playerData[uuid].lastLogin !== null) {
                playerData[uuid].playtime += playerData[uuid].lastLogout - playerData[uuid].lastLogin;
              }
            }
          }

          fs.writeFileSync("data/playerData.json", JSON.stringify(playerData, null, 2));
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, 1000);
}
