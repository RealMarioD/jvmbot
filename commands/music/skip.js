const { error } = require('../../util');
exports.run = (client, message) => {
    if(!message.guild.music || !client.voice.connections.get(message.guild.id)) return error('Nem szól semmi...', message);
    if(!message.member.voice.channel || message.member.voice.channelID != client.voice.connections.get(message.guild.id).channel.id) return error('Nem vagy egy voice channelben a bottal!', message);
    message.guild.music.dispatcher.emit('finish');
};

exports.info = {

    name: 'skip',
    category: 'music',
    syntax: '',
    description: 'A következő zenére ugrik.',
    requiredPerm: null,

};