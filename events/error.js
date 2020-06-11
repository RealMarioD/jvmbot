const { getDate } = require('../util.js');
module.exports = (client, info) => {
    console.error(`ERROR: ${info} @${getDate()}`);
};