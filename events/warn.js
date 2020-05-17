const { getDate } = require('../util.js');
module.exports = (client, info) => {
    console.warn(`WARN: ${info} @${getDate()}`);
    try {
        client.channels.cache.get(client.config.consoleLogChannelID).send(`>>> **WARN @ ${getDate()}**\n\`\`\`\n${info.toString()}\`\`\``).catch(() => {
            return;
        });
    }
    catch(err) {
        return;
    }
};