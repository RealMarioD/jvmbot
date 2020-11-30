const { sleep, eventObj } = require('../util');
const { MessageEmbed } = require('discord.js');
module.exports = (client, oldData, newData) => {
    if(eventObj.running &&
        oldData.channel &&
        oldData.member.id != client.user.id &&
        oldData.member.id in eventObj.listeners &&
        (!newData.channel ||
        oldData.channel.id != newData.channel.id)) {
            const missing = oldData.member;
            delete eventObj.listeners[missing.id];
            eventObj.beautyListeners.splice(eventObj.beautyListeners.indexOf(missing.toString()), 1);
            if(Object.entries(eventObj.listeners).length > 0) return eventObj.msg.channel.send(new MessageEmbed().setDescription(`${missing.toString()} elhagyta a voice channelt, így ő nem kap pontot mostantól.`));
            eventObj.eventDispatcher.player.voiceConnection.disconnect();
            eventObj.msg.channel.send(new MessageEmbed().setDescription('Mindenki elhagyta a voice channelt, így az eventnek vége.'));
    }
    else {
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
    }
};