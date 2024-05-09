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

    const { data } = await axios.get(`https://mowojang.matdoes.dev/${username}`);

    if (data.errorMessage || data.id === undefined) {
      throw data.errorMessage ?? "Invalid username.";
    }

    cache.set(username, {
      last_save: Date.now(),
      id: data.id,
    });

    return data.id;
  } catch (error) {
    console.log;

    throw error
  }
}

async function getUsername(uuid) {
  try {
    let cache = JSON.parse(fs.readFileSync("data/usernameCache.json"));

    const user = cache.find((data) => data.uuid === uuid);
    if (user !== undefined && user.last_save + 43200000 > Date.now()) {
      return user.username;
    }

    const { data } = await axios.get(`https://mowojang.matdoes.dev/${uuid}`);
    if (["id", "name"] in data === false) {
      throw data.code == "minecraft.invalid_username" ? "Invalid UUID." : data.message;
    }

    if (data.name === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "No username found for that UUID.";
    }

    cache = cache.filter((data) => data.id !== uuid);
    cache.push({
      username: data.name,
      uuid: uuid,
      last_save: Date.now(),
    });

    fs.writeFileSync("data/usernameCache.json", JSON.stringify(cache));

    console.log(`Cached username for ${data.name} (${uuid})`);

    return data.name;
  } catch (error) {
    console.log;

    throw error
  }
}

async function resolveUsernameOrUUID(username) {
  try {
    const { data } = await axios.get(`https://mowojang.matdoes.dev/${username}`);

    if (data.success === false || data.error === true) {
      throw data.message == "Mojang API lookup failed." ? "Invalid username." : data.message;
    }

    if (data.id === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "No UUID found for that username.";
    }

    return {
      username: data.name,
      uuid: data.id,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };
