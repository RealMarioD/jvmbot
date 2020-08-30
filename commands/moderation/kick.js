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

    message.guild.members.cache.get(punished.id).kick(reason);

    log('Kick', message.author, punished, reason);

    message.channel.send(`✅ **| ${punished.tag} kickelve lett${reason ? `: ${reason}` : '.'}**`);

};

exports.info = {

    name: 'kick',
    category: 'moderáció',
    syntax: '<tag> <ok>',
    description: 'Ezzel a paranccsal kickelni lehet tagokat.',
    requiredPerm: null,

};