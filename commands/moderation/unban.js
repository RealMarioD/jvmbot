const { log } = require('../../moderationHandler');
const { cmdUsage } = require('../../util');
exports.run = async (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);

    const punished = await client.users.fetch(args[0]);
    if(!punished) return message.channel.send('❌ **| Nincs ilyen tag!**');
    punished.user = punished;

    let reason;
    args.shift();
    if(args.length) reason = args.join(' ');

    message.guild.members.unban(punished, reason)
    .then(() => {
        log('Unban', message.author, punished, reason);

        message.channel.send(`✅ **| ${punished.tag} unbannolva lett${reason ? `: ${reason}` : '.'}**`);
    })
    .catch(() => message.channel.send(`❌ **| Nem tudom unbannolni ${punished.tag}-t!**`));

};

exports.info = {

    name: 'unban',
    category: 'moderáció',
    syntax: '<tagID> <ok>',
    description: 'Unbannol egy tagot.',
    requiredPerm: 'moderator',

};