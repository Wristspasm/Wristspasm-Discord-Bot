const axios = require("axios");

async function getUUID(username) {
  try {
    const { data } = await axios.get(`https://mowojang.matdoes.dev/${username}`);
    if (data.errorMessage || data.id === undefined) {
      throw data.errorMessage ?? "Invalid username.";
    }
    return data.id;
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line no-throw-literal
    if (error.response.data === "Not found") throw "Invalid username.";
    throw error;
  }
}

async function getUsername(uuid) {
  try {
    const { data } = await axios.get(`https://mowojang.matdoes.dev/${uuid}`);
    return data.name;
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line no-throw-literal
    if (error.response.data === "Not found") throw "Invalid UUID.";
    throw error;
  }
}

async function resolveUsernameOrUUID(username) {
  try {
    const { data } = await axios.get(`https://mowojang.matdoes.dev/${username}`);
    return { username: data.name, uuid: data.id };
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line no-throw-literal
    if (error.response.data === "Not found") throw "Invalid Username Or UUID.";
    throw error;
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };
