const { getDate } = require('../util.js');
module.exports = (client, event, shardID) => {
    console.log(`${shardID} lecsatlakoztatva! @${getDate()}`);
    client.login(client.config.token);
};