const { getDate } = require('../util.js');
module.exports = (client, info) => {
    console.warn(`WARN: ${info} @${getDate()}`);
};