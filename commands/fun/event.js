const { MessageEmbed } = require('discord.js');
const { jingleMyBalls } = require('../../util');
const { eventObj } = require('../../util');
exports.run = (client, message) => {
    const vc = message.member.voice.channel;
    if(!vc) return message.channel.send('> ❌ **| Lépj be egy voice channelbe...**');
    if(eventObj.running) return message.channel.send('> ❌ **| Már megy egy event!**');
    eventObj.listeners = {};
    eventObj.beautyListeners = [];
    vc.members.forEach(member => {
        if(member.id != client.user.id) eventObj.listeners[member.id] = member;
    });
    for(const member in eventObj.listeners) if(!eventObj.beautyListeners.includes(eventObj.listeners[member].toString())) eventObj.beautyListeners.push(eventObj.listeners[member].toString());
    message.channel.send(new MessageEmbed()
        .setTitle('🎄 Event 🎄')
        .setDescription(`Összesen **${Object.entries(eventObj.listeners).length}** tag fogja hallgatni az event zenét. Ha valaki kilép akkor az éppen játszódó zenét nem fogja elszámolni a kilépett tagnak, ha egyből visszalép se.\n\nHallgatók:\n${eventObj.beautyListeners.join(', ')}`)
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