exports.run = (client, message, args) => {
    message.channel.send(`Pong! \`${new Date().getTime() - message.createdTimestamp + " ms"}\``).catch(console.error);
}