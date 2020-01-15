const { getDate } = require('../util.js');
module.exports = (client) => {
    console.log(`Szétcsatlakoztatva! @${getDate()}`);
    client.login(client.config.token);
};