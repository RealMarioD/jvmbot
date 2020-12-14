const modCases = require('../../assets/modCases.json');
exports.run = (client, message, args) => {

    if(args.length < 2) return message.channel.send('> ❌ **| Helytelen használat.**');

    const thisCase = modCases.cases[args[0]];
    if(!thisCase) return message.channel.send('> ❌ **| Nincs ilyen case.**');

    const caseNumber = args.shift();

    client.channels.cache.get(client.config.modLogChannel).messages.fetch(thisCase.msgID)
    .then(msg => {
        if(!msg) return message.channel.send('> ❌ **| Nem tudom szerkeszteni ezt az ügyet.**');
        const newEmbed = msg.embeds[0];

        newEmbed.fields[2].value = args.join(' ');
        msg.edit('', newEmbed);
    });

    message.channel.send(`> ✅ **| ${caseNumber}. eljárás oka megváltoztatva!**`);

};

exports.info = {

    name: 'modcase',
    category: 'moderáció',
    syntax: '<case szám> <ok>',
    description: 'Egy eljárás okát lehet megváltoztatni ezzel a paranccsal.',
    requiredPerm: 'moderator',

};
