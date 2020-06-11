exports.run = (client, message) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('Nem szól semmi...');
    client.dispatcher.resume();
    message.channel.send('> ▶️ **| Zene folytatva.**');

};

exports.info = {

    name: 'resume',
    category: 'music',
    syntax: '',
    description: 'Folytatja a visszajátszást.',
    requiredPerm: null

};