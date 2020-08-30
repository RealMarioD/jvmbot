const { log } = require('../../moderationHandler');
const ms = require('ms');
exports.run = (client, message, args) => {

    if(!args.length) return message.channel.send('> ❌ **| Helytelen használat.**');

    let punished;
    let reason;

    if(!message.mentions.users.size) punished = message.guild.members.cache.get(args[0]);
    else punished = message.mentions.members.first();

    if(!punished) return message.channel.send('❌ **| Nincs ilyen tag!**');

    args.shift();

    let i = 0;
    let totalTimeout = 0;
    let loopSwitch = true;

    while(loopSwitch) {
        if(ms(args[i])) {
            totalTimeout += ms(args[i]);
            i++;
        }
        else loopSwitch = false;
    }

    for(let j = 1; j <= i; j++) args.shift();

    if(args.length) reason = args.join(' ');

    punished.roles.add(client.config.muteRole, reason);

    log('Mute', message.author, punished, reason, totalTimeout);

    message.channel.send(`✅ **| ${punished.user.tag} muteolva lett ${totalTimeout / 1000 / 60} percre${reason ? `: ${reason}` : '.'}**`);

};

exports.info = {

    name: 'mute',
    category: 'moderáció',
    syntax: '<tag> <idő> <ok>',
    description: 'Ezzel a paranccsal muteolni lehet tagokat.',
    requiredPerm: null,

};