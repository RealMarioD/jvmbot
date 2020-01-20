exports.run = (client, message) => {
    const creationTime = new Date(message.guild.createdAt);
    message.channel.send({
        embed: {
            color: 0xDB6206,
            title: `\`\`${message.guild.name}\`\``,
            thumbnail: {
                url: message.guild.iconURL
            },
            author: {
                name: 'JustVidman',
                icon_url: 'https://yt3.ggpht.com/a/AGF-l79gTj0WzuZJvH-LDfLpx8iS1Yds282ME2fXUw=s900-mo-c-c0xffffffff-rj-k-no',
                url: 'https://www.youtube.com/JustVidman'
            },
            fields: [
                {
                    name: 'Tagok száma:',
                    value: message.guild.members.size,
                    inline: true
                },
                {
                    name: 'Ebből ebből emberi lények:',
                    value: message.guild.members.filter(m => !m.user.bot).size,
                    inline: true
                },
                {
                    name: 'Ebből online:',
                    value:  message.guild.members.filter(u => u.presence.status === 'online' && !u.user.bot).size,
                    inline: true
                },
                {
                    name: 'Tulajdonos',
                    value: message.guild.owner.user.tag,
                    inline: true
                },
                {
                    name: 'Szerver létrehozva:',
                    value: creationTime.toLocaleDateString(),
                    inline: true
                }
            ]
        }
    });
};

exports.info = {

    name: 'info',
    syntax: '',
    description: 'Információ a szerverről.',
    requiredPerm: null

};
