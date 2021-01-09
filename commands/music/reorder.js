const { getEmoji, error, cmdUsage } = require('../../util');
exports.run = (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);
    if(!message.guild.music || !client.voice.connections.get(message.guild.id)) return error('Nem szól semmi...', message);
    if(!message.member.voice.channel || message.member.voice.channelID != client.voice.connections.get(message.guild.id).channel.id) return error('Nem vagy egy voice channelben a bottal!', message);

    const mgm = message.guild.music;
    let numbertoMove;
    if(args[0].toLowerCase() == 'last') numbertoMove = mgm.queue.length - 1;
    else numbertoMove = parseInt(args[0]);
    if(isNaN(numbertoMove) || !numbertoMove || numbertoMove > mgm.queue.length - 1) return error('Nincs ilyen szám!', message);

    let placeToMove = 1;
    if(args[1]) placeToMove = parseInt(args[1]);
    if(placeToMove == 0) placeToMove = 1;
    if(isNaN(placeToMove)) return error('Nem számot adtál meg!', message);
    if(placeToMove > mgm.queue.length - 1) placeToMove = mgm.queue.length - 1;

    mgm.queue.splice(placeToMove, 0, mgm.queue[numbertoMove]);

    mgm.queue.splice(numbertoMove + 1, 1);

    message.channel.send(`> ${getEmoji('vidmanOke')} **| A(z) ${numbertoMove}.helyen lévő szám áthelyezve a(z) ${placeToMove}.helyre!**`);
};

exports.info = {

    name: 'reorder',
    category: 'music',
    syntax: '',
    description: 'A listát lehet módosítani ezzel a paranccsal.',
    requiredPerm: null,
    aliases: ['order', 'move']

};