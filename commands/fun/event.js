const { MessageEmbed } = require('discord.js');
const { jingleMyBalls } = require('../../util');

exports.run = (client, message) => {
    const { running, listeners, beautyListeners } = require('../../util').eventObj;
    const vc = message.member.voice.channel;
    if(!vc) return message.channel.send('> ❌ **| Lépj be egy voice channelbe...**');
    if(running) return message.channel.send('> ❌ **| Már megy egy event!**');
    vc.members.forEach(member => {
        if(member.id != client.user.id) listeners[member.id] = member;
    });
    for(const member in listeners) if(!beautyListeners.includes(listeners[member].toString())) beautyListeners.push(listeners[member].toString());
    message.channel.send(new MessageEmbed()
        .setTitle('🎄 Event 🎄')
        .setDescription(`Összesen **${Object.entries(listeners).length}** tag fogja hallgatni az event zenét. Ha valaki kilép akkor az éppen játszódó zenét nem fogja elszámolni a kilépett tagnak, ha egyből visszalép se.\n\nHallgatók:\n${beautyListeners.join(', ')}`)
    );
    vc.join()
    .then(connection => {
        jingleMyBalls(connection, message);
    });
};

exports.info = {

    name: 'event',
    category: 'szórakozás',
    syntax: '',
    description: 'Meglepi.',
    requiredPerm: null,

};