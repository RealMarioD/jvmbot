exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('Nem szól semmi...');
    if(!message.member.voice.channel || message.member.voice.channel.id != client.dispatcher.player.voiceConnection.channel.id) return message.channel.send('> ❌ **| Nem vagy egy voice channelben a bottal!**');
    client.dispatcher.resume();
    message.channel.send('> ▶️ **| Zene folytatva.**');

};

exports.info = {

    name: 'resume',
    category: 'music',
    syntax: '',
    description: 'Folytatja a visszajátszást.',
    requiredPerm: null,
    aliases: ['r', 're', 'resum']

};