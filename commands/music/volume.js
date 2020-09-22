exports.run = (client, message, args) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('> 🔇 **| Nem szól semmi.**');
    if(!message.member.voice.channel || message.member.voice.channel.id != client.dispatcher.player.voiceConnection.channel.id) return message.channel.send('> ❌ **| Nem vagy egy voice channelben a bottal!**');
    if(!args.length) return message.channel.send('> ❌ **| Nem adtál meg értéket!**');
    const volume = parseInt(args[0]);
    if(volume > 150 || volume < 1 || isNaN(volume)) return message.channel.send('> ❌ **| Túl halk vagy túl hangos a megadott érték! `(1 - 150)`**');
    client.volume = Math.round(volume / 100);
    client.dispatcher.setVolumeLogarithmic(Math.round(volume / 100));
    message.channel.send(`> 🔉 **| Hangerő átállítva. \`(${Math.round(volume / 100)}%)\`**`);

};

exports.info = {

    name: 'volume',
    category: 'music',
    syntax: '',
    description: 'A visszajátszás hangerejét lehet állítani ezzel a paranccsal.',
    requiredPerm: null,
    aliases: ['v', 'vol']

};