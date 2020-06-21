const { sleep } = require('../util');
module.exports = (client, oldData, newData) => {
    if(!Object.keys(client.dispatcher).length) return;
    if(oldData.member.id == client.user.id) return;
    if(oldData.channel &&
    oldData.channel.id == client.dispatcher.player.voiceConnection.channel.id &&
    (!newData.channel ||
    newData.channel.id != client.dispatcher.player.voiceConnection.channel.id) &&
    client.dispatcher.player.voiceConnection.channel.members.size == 1) {
        client.dispatcher.pause();
        client.message.channel.send('⏸️ **| Mindenki elhagyta a voice channelt. Zene megállítva.**');
        sleep(180000).then(() => {
            if(!Object.keys(client.dispatcher).length) return;
            if(client.dispatcher.player.voiceConnection.channel.members.size == 1) {
                client.queue = [];
                client.dispatcher.emit('finish');
                client.dispatcher = {};
            }
        });
    }
    if((!oldData.channel ||
    oldData.channel.id != client.dispatcher.player.voiceConnection.channel.id) &&
    newData.channel &&
    newData.channel.id == client.dispatcher.player.voiceConnection.channel.id &&
    newData.channel.members.size == 2) {
        client.dispatcher.resume();
        client.message.channel.send('▶️ **| Valaki visszalépett. Zene elindítva.**');
    }
};