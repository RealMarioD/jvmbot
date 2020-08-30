exports.run = (client, message) => {
    const member = message.guild.members.cache.get(message.author.id);
    if(member._roles.includes(client.config.ytID) === false) {
        member.roles.add(client.config.ytID).then(() =>
            message.channel.send('>>> ✅ **Feliratkoztál** a szerver YouTube hírlevelére! 📨'));
    }
    else {
        member.roles.remove(client.config.ytID).then(() =>
            message.channel.send('>>> ✅ **Leiratkoztál** a szerver YouTube hírleveléről! 📨'));
    }
};

exports.info = {

    name: 'youtube',
    category: 'egyéb',
    syntax: '',
    description: 'Fel/le tudsz iratkozni a YouTube hírlevélre/ről ezzel a paranccsal.',
    requiredPerm: null,
    aliases: ['yt']

};