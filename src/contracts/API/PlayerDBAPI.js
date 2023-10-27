const axios = require("axios");
const fs = require("fs");

const cache = new Map();

async function getUUID(username) {
  try {
    if (cache.has(username)) {
      const data = cache.get(username);

      if (data.last_save + 43200000 > Date.now()) {
        return data.id;
      }
    }

    const { data } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);

    if (data.errorMessage || data.id === undefined) {
      throw data.errorMessage ?? "Invalid username.";
    }

    cache.set(username, {
      last_save: Date.now(),
      id: data.id,
    });

    return data.id;
  } catch (error) {
    if (error.response.data.errorMessage !== undefined) {
      throw error.response.data.errorMessage === `Couldn't find any profile with name ${username}`
        ? "Invalid username."
        : error.response.data.errorMessage ===
          "getProfileName.name: Invalid profile name, getProfileName.name: size must be between 1 and 25"
        ? "Invalid username."
        : error.response.data.errorMessage;
    }

    // eslint-disable-next-line no-throw-literal
    throw "Request to Mojang API failed. Please try again!";
  }
}

async function getUsername(uuid) {
  try {
    let cache = JSON.parse(fs.readFileSync("data/usernameCache.json"));

    const user = cache.find((data) => data.uuid === uuid);
    if (user !== undefined && user.last_save + 43200000 > Date.now()) {
      return user.username;
    }

    const { data } = await axios.get(`https://playerdb.co/api/player/minecraft/${uuid}`);
    if ("data" in data === false) {
      throw data.code == "minecraft.invalid_username" ? "Invalid UUID." : data.message;
    }

    if (data.data?.player?.username === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "No username found for that UUID.";
    }

    cache = cache.filter((data) => data.uuid !== uuid);
    cache.push({
      username: data.data.player.username,
      uuid: uuid,
      last_save: Date.now(),
    });

    fs.writeFileSync("data/usernameCache.json", JSON.stringify(cache));

    console.log(`Cached username for ${data.data.player.username} (${uuid})`);

    return data.data.player.username;
  } catch (error) {
    console.log(error);
    if (error.response?.data === undefined) {
      console.log;
      // eslint-disable-next-line no-throw-literal
      throw "Request to Mojang API failed. Please try again!";
    }

    console.log(uuid, error.response.data);

    throw error.response.data.message === `No Minecraft user could be found.`
      ? "Invalid UUID."
      : error.response.data.message;
  }
}

async function resolveUsernameOrUUID(username) {
  try {
    const { data } = await axios.get(`https://playerdb.co/api/player/minecraft/${username}`);

    if (data.success === false || data.error === true) {
      throw data.message == "Mojang API lookup failed." ? "Invalid username." : data.message;
    }

    if (data.data?.player?.raw_id === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "No UUID found for that username.";
    }

    return {
      username: data.data.player.username,
      uuid: data.data.player.raw_id,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };
