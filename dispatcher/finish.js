const { play } = require('../util');
module.exports = (client) => {
    if(!client.loop) {
        client.queue = client.queue.splice(1);
        if(client.queue.length == 0) {
            client.message.channel.send('⏹️ **| Lejátszási lista vége.**');
            client.message.guild.voice.connection.disconnect();
        }
        else {
            play(client.message.guild.voice.connection, client.message);
        }
    }
    else if(client.loop == 'queue') {
        client.queue.push(client.queue[0]);
        client.queue = client.queue.splice(1);
        play(client.message.guild.voice.connection, client.message);
    }
    else if(client.loop == 'song') {
        play(client.message.guild.voice.connection, client.message);
    }
};