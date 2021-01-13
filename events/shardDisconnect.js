const { getDate } = require('../util.js');
module.exports = (client, event, shardID) => {
    console.log(`DISCONNECTED SHARD ID: ${shardID} @ ${getDate()}`);
    client.login(client.config.token);
};