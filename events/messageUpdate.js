const { webHook } = require('../util');

module.exports = (client, oldMessage, newMessage) => {
    const splitContent = newMessage.content.split(':');
    if(!newMessage.deleted && newMessage.editedTimestamp - oldMessage.createdTimestamp <= 30000 && !newMessage.author.bot && splitContent.some(x => client.emojis.cache.find(e => e.name === x) && (!client.emojis.cache.find(e => e.name === x).available || client.emojis.cache.find(e => e.name === x).animated || client.emojis.cache.find(e => e.name === x).guild.name === 'j v m b o t'))) webHook(splitContent, newMessage);
};