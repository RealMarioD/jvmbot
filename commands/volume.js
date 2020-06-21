exports.run = (client, message, args) => {

    if(!message.guild.voice || !message.guild.voice.connection) return message.channel.send('> 🔇 **| Nem szól semmi.**');
    if(!message.member.voice || message.member.voice.channel.id != client.dispatcher.player.voiceConnection.channel.id) return message.channel.send('> ❌ **| Nem vagy egy voice channelben a bottal!**');
    if(!args.length) return message.channel.send('> ❌ **| Nem adtál meg értéket!**');
    const volume = parseFloat(args[0]);
    if(volume > 1.5 || volume < 0.1 || isNaN(volume)) return message.channel.send('> ❌ **| Túl halk vagy túl hangos a megadott érték! `(0.1 - 1.5)`**');
    client.volume = volume;
    client.dispatcher.setVolumeLogarithmic(volume);
    message.channel.send(`> 🔉 **| Hangerő átállítva. \`(${volume})\`**`);

};

exports.info = {

    name: 'volume',
    category: 'music',
    syntax: '',
    description: 'A visszajátszás hangerejét lehet állítani ezzel a paranccsal.',
    requiredPerm: null,
    aliases: ['v', 'vol']

};