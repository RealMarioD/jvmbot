exports.run = (client, message, args) => {
    message.channel.send(`Pong! \`${new Date().getTime() - message.createdTimestamp + " ms"}\``).catch(console.error);
};

exports.info = {

    syntax: '',
    description: 'Megmondja a pinget'

}
