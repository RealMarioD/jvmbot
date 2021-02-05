const { log } = require('../../moderationHandler');
const { cmdUsage, findMember } = require('../../util');
exports.run = (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);

    const punished = findMember(args[0], message);
    if(!punished) return message.channel.send('❌ **| Nincs ilyen tag!**');

    let reason;
    args.shift();
    if(args.length) reason = args.join(' ');

    punished.kick(reason)
    .then(() => {
        log('Kick', message.author, punished, reason);

        message.channel.send(`✅ **| ${punished.user.tag} kickelve lett${reason ? `: ${reason}` : '.'}**`);
    })
    .catch(() => message.channel.send(`❌ **| Nem tudom kickelni ${punished.user.tag}-t!**`));

};

exports.info = {

    name: 'kick',
    category: 'moderáció',
    syntax: '<tag> <ok>',
    description: 'Ezzel a paranccsal kickelni lehet tagokat.',
    requiredPerm: 'moderator',

};