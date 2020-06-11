const { getEmoji } = require('../util');
exports.run = (client, message, args) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('> ❌ **| Nincs lejátszási lista!**');
    if(!args.length) return message.channel.send('> ❌ **| Nem adtál meg számot!**');

    const numbertoMove = parseInt(args[0]);
    if(!numbertoMove || numbertoMove > client.queue.length - 1) return message.channel.send('> ❌ **| Nincs ilyen szám!**');

    let placeToMove = 1;
    if(args[1]) placeToMove = parseInt(args[1]);
    if(isNaN(numbertoMove) || isNaN(placeToMove)) return message.channel.send('> ❌ **| Nem számot adtál meg!**');
    if(placeToMove > client.queue.length - 1) placeToMove = client.queue.length - 1;

    client.queue.splice(placeToMove, 0, client.queue[numbertoMove]);

    client.queue.splice(numbertoMove + 1, 1);

    message.channel.send(`> ${getEmoji('vidmanOke')} **| A(z) ${numbertoMove}.helyen lévő szám áthelyezve a(z) ${placeToMove}.helyre!**`);
};

exports.info = {

    name: 'reorder',
    category: 'music',
    syntax: '',
    description: 'A listát lehet módosítani ezzel a paranccsal.',
    requiredPerm: null

};