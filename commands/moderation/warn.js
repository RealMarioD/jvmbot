const { log } = require('../../moderationHandler');
const { cmdUsage, findMember } = require('../../util');
exports.run = (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);

    const punished = findMember(args[0], message);
    if(!punished) return message.channel.send('❌ **| Nincs ilyen tag!**');

    let reason;
    args.shift();
    if(args.length) reason = args.join(' ');

    log('Warn', message.author, punished, reason);

    message.channel.send(`✅ **| ${punished.user.tag} figyelmeztetve lett${reason ? `: ${reason}` : '.'}**`);

};

exports.info = {

    name: 'warn',
    category: 'moderáció',
    syntax: '<tag> <ok>',
    description: 'Ezzel a paranccsal figyelmeztetést lehet adni tagoknak.',
    requiredPerm: 'moderator',

};