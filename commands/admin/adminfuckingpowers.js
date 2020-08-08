const fasz = require('fs');
const gayppl = require('../../assets/users.json');
const { getEmoji } = require('../../util');
exports.run = (client, message, args) => {

    if(args.length === 0) return message.channel.send('> ❌ **| N E M**');
    const whoToAbuse = message.mentions.users.first();
    if(!whoToAbuse) return message.channel.send('❌ **| BIG FDUKCING NONO**');
    let abuseAmount;
    switch(args[0]) {
        case 'show':
            if(!gayppl[whoToAbuse.id]) {
                gayppl[whoToAbuse.id] = {
                    money: 0
                };
            }
            message.channel.send(`>>> __${whoToAbuse.tag}:__ **${gayppl[whoToAbuse.id].money}**${getEmoji('vidmani')}`);
            break;

        case 'change':
            abuseAmount = parseInt(args[2]);
            if(!abuseAmount || isNaN(abuseAmount)) return message.channel.send('❌ **| WTF MAN**');
            gayppl[whoToAbuse.id].money += abuseAmount;
            fasz.writeFileSync('./assets/users.json', JSON.stringify(gayppl, null, 2));
            message.channel.send('> ✅ **| YEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE**');
            break;

        default:
            message.channel.send('❌ **| BRUH WTF ABORT**');
            break;
    }

};

exports.info = {

    name: 'adminfuckingpowers',
    category: 'admin',
    syntax: '<i g e n>',
    description: 'Ezzel a paranccsal  i g e n.',
    requiredPerm: 'developer',
    aliases: ['afp']

};