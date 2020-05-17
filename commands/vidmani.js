const users = require('../assets/users.json');
exports.run = (client, message) => {

    if (!users[message.author.id]) {
        users[message.author.id] = {
            money: 0
        };
    }
    message.channel.send(`>>> __${message.author.tag}:__ **${users[message.author.id].money}**<:vidmani:701782953679782019>`);
};

exports.info = {

    name: 'vidmani',
    category: 'szórakozás',
    syntax: '',
    description: 'Kiírja, hogy mennyi Vidmánid van!',
    requiredPerm: null

};
