const users = require('../assets/users.json');
const { getEmoji } = require('../util');
exports.run = (client, message) => {

    if (!users[message.author.id]) {
        users[message.author.id] = {
            money: 0
        };
    }
    message.channel.send(`>>> __${message.author.tag}:__ **${users[message.author.id].money}**${getEmoji('vidmani')}`);
};

exports.info = {

    name: 'vidmani',
    category: 'szórakozás',
    syntax: '',
    description: 'Kiírja, hogy mennyi Vidmánid van!',
    requiredPerm: null,
    aliases: ['mani']

};