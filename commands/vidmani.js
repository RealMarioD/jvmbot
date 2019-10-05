const users = require('../assets/users.json')
exports.run = (client, message, args) => {

    if (!users[message.author.id]) {
        users[message.author.id] = {
            money: 0
        };
    }
    message.channel.send(`>>> __${message.author.tag}__-nak **${users[message.author.id].money}** Vidmánija van!`)
};

exports.info = {
    syntax: '',
    description: 'Kiírja, hogy mennyi Vidmánid van!'
};
