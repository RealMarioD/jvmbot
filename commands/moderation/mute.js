const { log } = require('../../moderationHandler');
const ms = require('ms');
const { cmdUsage, findMember } = require('../../util');
exports.run = (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);

    const punished = findMember(args[0], message);
    if(!punished) return message.channel.send('❌ **| Nincs ilyen tag!**');

    if(punished._roles.includes(client.config.roles.muted)) return message.channel.send('❌ **| Ez a tag már némítva van!**');

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

    let reason;
    if(args.length) reason = args.join(' ');

    punished.roles.add(client.config.roles.muted, reason)
    .then(() => {
        log('Mute', message.author, punished, reason, totalTimeout);
        message.channel.send(`✅ **| ${punished.user.tag} muteolva lett ${totalTimeout / 1000 / 60} percre${reason ? `: ${reason}` : '.'}**`);
    })
    .catch(() => message.channel.send(`❌ **| Nem tudom muteolni ${punished.user.tag}-t!**`));

};

exports.info = {

    name: 'mute',
    category: 'moderáció',
    syntax: '<tag> <idő> <ok>',
    description: 'Ezzel a paranccsal muteolni lehet tagokat.',
    requiredPerm: 'moderator',

};