const { getDate } = require('../util.js');
module.exports = (client, info) => {
    console.warn(`ERROR: ${info.toString()} @${getDate()}`);
    try {
        client.channels.cache.get(client.config.consoleLogChannelID).send(`>>> **ERROR @ ${getDate()}**\n\`\`\`\n${info.toString()}\`\`\``).catch(() => {
            return;
        });
    }
    catch(err) {
        return;
    }
};