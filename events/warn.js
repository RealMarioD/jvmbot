const { getDate } = require('../util.js');
module.exports = (client, info) => {
    console.warn(`WARN: ${info} @${getDate()}`);
    try {
        client.guilds.get(client.config.serverID).channels.get(client.config.consoleLogChannelID).send(`>>> **WARN @ ${getDate()}**\n\`\`\`\n${info}\`\`\``).catch(() => {
            return;
        });
    }
    catch(err) {
        return;
    }
};