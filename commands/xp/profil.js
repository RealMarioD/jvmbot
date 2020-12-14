const users = require('../../assets/users.json');
const fs = require('fs');
const { cmdUsage } = require('../../util');
exports.run = (client, message, args) => {
    if(!args.length) return cmdUsage(this, message);
    const color = args[0].toLowerCase();
    if(color.length != 6) return message.channel.send('Nem megfelelő formátumú színt adtál meg!');
    for(let i = 0; i < color.length; i++) {
        const c = color.charAt(i);
        if(!'0123456789abcdef'.includes(c)) return message.channel.send('Nem megfelelő formátumú színt adtál meg!');
    }
    users[message.author.id].colour = color;
    message.reply('sikeresen megváltoztattad a profilod színét!');
    fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
};

exports.info = {

    name: 'profil',
    category: 'xp',
    syntax: '<hex szín>',
    description: 'Megváltoztatja a profilod színét',
    requiredPerm: null,
    aliases: ['profile']

};