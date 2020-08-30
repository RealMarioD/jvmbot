const { getDate } = require('../util.js');
const moderationHandler = require('../moderationHandler');
module.exports = (client) => {
    console.log(`~~~ Bejelentkezve mint: ${client.user.tag} ~~~ @ ${getDate()}`);
    client.user.setActivity('.parancsok');
    moderationHandler.initMute();
};