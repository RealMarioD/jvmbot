const { log } = require('../../moderationHandler');
exports.run = (client, message, args) => {

    if(!args.length) return message.channel.send('> ❌ **| Helytelen használat.**');

    let punished;
    let reason;

    if(!message.mentions.users.size) punished = client.users.cache.get(args[0]);
    else punished = message.mentions.users.first();

    if(!punished) return message.channel.send('❌ **| Nincs ilyen tag!**');

    args.shift();
    if(args.length) reason = args.join(' ');

   log('Warn', message.author, punished, reason);

   message.channel.send(`✅ **| ${punished.tag} figyelmeztetve lett${reason ? `: ${reason}` : '.'}**`);

};

exports.info = {

    name: 'warn',
    category: 'moderáció',
    syntax: '<tag> <ok>',
    description: 'Ezzel a paranccsal figyelmeztetést lehet adni tagoknak.',
    requiredPerm: null,

};