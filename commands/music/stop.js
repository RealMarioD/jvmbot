const { error } = require('../../util');
exports.run = (client, message) => {

    if(!message.guild.music || !client.voice.connections.get(message.guild.id)) return error('Nem szól semmi...', message);
    if(!message.member.voice.channel || message.member.voice.channelID != client.voice.connections.get(message.guild.id).channel.id) return error('Nem vagy egy voice channelben a bottal!', message);
    client.voice.connections.get(message.guild.id).disconnect();
    message.guild.music = {
        queue: [],
        dispatcher: null,
        loop: message.guild.music.loop
    };
    message.channel.send('> ⏹️ **| Zene megállítva és lista törölve.**');

};

exports.info = {

    name: 'stop',
    category: 'music',
    syntax: '',
    description: 'Megállítja a zenét.',
    requiredPerm: null,

};