const { error } = require('../../util');
exports.run = (client, message) => {

    if(!message.guild.music || !client.voice.connections.get(message.guild.id)) return error('Nem szól semmi...', message);
    if(!message.member.voice.channel || message.member.voice.channelID != client.voice.connections.get(message.guild.id).channel.id) return error('Nem vagy egy voice channelben a bottal!', message);

    const mgm = message.guild.music;
    if(mgm.dispatcher.paused) {
        mgm.dispatcher.resume();
        message.channel.send('> ▶️ **| Zene folytatva.**');
    }
    else {
        mgm.dispatcher.pause();
        message.channel.send('> ⏸️ **| Zene szünetelve.**');
    }

};

exports.info = {

    name: 'pause',
    category: 'music',
    syntax: '',
    description: 'Megállítja a visszajátszást.',
    requiredPerm: null,
    aliases: ['resume']

};