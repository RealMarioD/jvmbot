exports.run = (client, message) => {

    const connection = client.voice.connections.get(message.guild.id);
    if(connection) connection.disconnect();
    message.guild.music = {
        queue: [],
        dispatcher: null,
        loop: message.guild.music.loop
    };
    message.channel.send('> ⏹️ **| Zene megállítva és lista törölve.**');

};

exports.info = {

    name: 'forcestop',
    category: 'music',
    syntax: '',
    description: 'Megállítja a zenét.',
    requiredPerm: null,

};