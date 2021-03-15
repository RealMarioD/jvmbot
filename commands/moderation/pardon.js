const { log, pardon } = require('../../moderationHandler');
const { cmdUsage } = require('../../util');
exports.run = async (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);

    if(args[0] == 'reset') {
        pardon.splice(0, pardon.length);
        return message.channel.send('✅ **| Pardon lista törölve!');
    }
    const punished = await client.users.fetch(args[0]).catch(() => {
        return undefined;
    });
    if(!punished) return message.channel.send('❌ **| Nincs ilyen tag!**');
    punished.user = punished;

    let reason;
    args.shift();
    if(args.length) reason = args.join(' ');

    pardon.push(punished.id);
    log('Pardon', message.author, punished, reason);

    message.channel.send(`✅ **| ${punished.tag} átengedve a szűrőn${reason ? `: ${reason}` : '.'}**`);

};

exports.info = {

    name: 'pardon',
    category: 'moderáció',
    syntax: '<tagID> <ok>',
    description: 'Átenged egy tagot a raid szűrőn.',
    requiredPerm: 'moderator',

};