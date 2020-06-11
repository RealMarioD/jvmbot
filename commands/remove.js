const { getEmoji } = require('../util');
exports.run = (client, message, args) => {

    if(!message.guild.voice || !message.guild.voice.connection || !client.queue) return message.channel.send('> ❌ **| Nincs lejátszási lista!**');
    if(!args.length) return message.channel.send('> ❌ **| Nem adtál meg számot!**');
    const number = parseInt(args[0]);
    if(!number || number > client.queue.length - 1) return message.channel.send('> ❌ **| Nincs ilyen szám!**');
    client.queue.splice(number, 1);
    message.channel.send(`> ${getEmoji('vidmanOke')} **| A(z) ${number}.helyen lévő szám törölve!**`);
};

exports.info = {

    name: 'remove',
    category: 'music',
    syntax: '',
    description: 'Ezzel a paranccsal videókat lehet eltávolítani a lejátszási listáról.',
    requiredPerm: null

};