const { getDate, doBackup } = require('../util.js');
const moderationHandler = require('../moderationHandler');
const schedule = require('node-schedule');
module.exports = (client) => {
    console.log(`${client.user.id == client.config.normalID ? 'NORMAL' : 'DEV'} LOGIN: ${client.user.tag}  @ ${getDate()}`);
    if(client.user.id == client.config.normalID) client.user.setActivity('.parancsok');
    else client.user.setActivity('/parancsok');
    moderationHandler.initMute();

    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;
    client.backup = schedule.scheduleJob(rule, () => doBackup());
};