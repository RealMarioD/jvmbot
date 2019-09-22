const {magicBall} = require('../util');
exports.run = (client, message, args) => {
    message.channel.send(`${message.author.tag}, a válaszod:\n>>> ${magicBall()}`)
};

exports.info = {
    syntax: '',
    description: 'Válaszol egy igen-nem kérdésedre!'
};
