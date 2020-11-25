const { getDate, doBackup } = require('../util.js');
const moderationHandler = require('../moderationHandler');
const schedule = require('node-schedule');
module.exports = (client) => {
    console.log(`~~~ Bejelentkezve mint: ${client.user.tag} ~~~ @ ${getDate()}`);
    client.user.setActivity('.parancsok');
    moderationHandler.initMute();

    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;
    client.backup = schedule.scheduleJob(rule, () => doBackup());
};