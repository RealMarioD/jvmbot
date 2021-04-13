const { getEmoji, error, cmdUsage } = require('../../util');
exports.run = (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);
    if(!message.guild.music || !client.voice.connections.get(message.guild.id)) return error('Nem szól semmi...', message);
    if(!message.member.voice.channel || message.member.voice.channelID != client.voice.connections.get(message.guild.id).channel.id) return error('Nem vagy egy voice channelben a bottal!', message);
    const mgm = message.guild.music;
    if(!mgm.queue.length) return error('A lejátszási lista üres!', message);
    const number = parseInt(args[0]);
    if(!number || number > mgm.length - 1) return error('Nincs ilyen szám!', message);
    mgm.queue.splice(number, 1);
    message.channel.send(`> ${getEmoji('vidmanOke')} **| A(z) ${number}.helyen lévő szám törölve!**`);
};

exports.info = {

    name: 'remove',
    category: 'music',
    syntax: '<zene száma a lejátszási listán>',
    description: 'Ezzel a paranccsal videókat lehet eltávolítani a lejátszási listáról.',
    requiredPerm: null,

};