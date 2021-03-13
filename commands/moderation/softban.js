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
        message.guild.members.unban(punished.id);
        log('Softban', message.author, punished, reason);
        message.channel.send(`✅ **| ${punished.user.tag} softbannolva lett${reason ? `: ${reason}` : '.'}**`);
    })
    .catch(() => message.channel.send(`❌ **| Nem tudom softbannolni ${punished.user.tag}-t!**`));

};

exports.info = {

    name: 'softban',
    category: 'moderáció',
    syntax: '<tag> <ok>',
    description: 'Bannol majd instant unbannol egy tagot. Üzenet törléses kickre jó.',
    requiredPerm: 'moderator',

};