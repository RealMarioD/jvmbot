const { play } = require('../util');
module.exports = (client) => {
  client.queue = client.queue.splice(1);
  if(client.queue.length == 0) {
    client.message.channel.send('Lejátszási lista vége.');
    client.message.guild.voice.connection.disconnect();
  }
  else {
    play(client.message.guild.voice.connection, client, client.message);
  }
};