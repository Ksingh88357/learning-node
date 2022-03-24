const config = require("config");
const token = config.get("token");

const configuration = {
    headers: {
        Authorization: token,
        "Content-Type": "application/json",
    },
};

module.exports = { configuration }