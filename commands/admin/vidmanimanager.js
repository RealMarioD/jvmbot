const fs = require('fs');
const users = require('../../assets/users.json');
const { getEmoji, cmdUsage, findMember } = require('../../util');
exports.run = (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);
    const member = findMember(args[0], message, true);
    if(!member) return message.channel.send('> ❌ **| Nincs ilyen tag.**');
    let moneyChangeValue;
    switch(args[1]) {
        case 'change':
            moneyChangeValue = parseInt(args[2]);
            if(!moneyChangeValue || isNaN(moneyChangeValue)) return message.channel.send('❌ **| Az érték nem szám.**');
            users[member.id].money += moneyChangeValue;
            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
            message.channel.send(`> ✅ **| ${member.tag} Vidmanija módosítva: ${users[member.id].money - moneyChangeValue} >> ${users[member.id].money}**`);
            break;

        default:
            if(!users[member.id]) {
                users[member.id] = {
                    money: 0
                };
            }
            message.channel.send(`>>> __${member.tag}:__ **${users[member.id].money}**${getEmoji('vidmani')}`);
            break;
    }

};

exports.info = {

    name: 'vidmanimanager',
    category: 'admin',
    syntax: '<tag> [change] [érték]',
    description: 'Ezzel a paranccsal a tagok Vidmanijába lehet belenyúlni.',
    requiredPerm: 'admin',
    aliases: ['vm', 'afp']

};