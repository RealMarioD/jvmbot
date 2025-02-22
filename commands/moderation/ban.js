const { log } = require('../../moderationHandler');
const { cmdUsage, findMember } = require('../../util');
exports.run = (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);

    const punished = findMember(args[0], message);
    if(!punished) return message.channel.send('❌ **| Nincs ilyen tag!**');

    let reason;
    args.shift();
    if(args.length) reason = args.join(' ');

    punished.ban({ days: 7, reason: reason })
    .then(() => {
        log('Ban', message.author, punished, reason);

        message.channel.send(`✅ **| ${punished.user.tag} bannolva lett${reason ? `: ${reason}` : '.'}**`);
    })
    .catch(() => message.channel.send(`❌ **| Nem tudom bannolni ${punished.user.tag}-t!**`));

};

exports.info = {

    name: 'ban',
    category: 'moderáció',
    syntax: '<tag> <ok>',
    description: 'Ezzel a paranccsal bannolni lehet tagokat.',
    requiredPerm: 'moderator',

};