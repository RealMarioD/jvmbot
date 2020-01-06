exports.run = (client, message, args) => {
    let creationTime = new Date(message.guild.createdAt)
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
                    name: 'Emberi lények száma:',
                    value: message.guild.members.filter(m => m.user.bot == false).size,
                    inline: true
                },
                {
                    name: 'Ebből online:',
                    value: message.guild.members.filter(u => u.presence.status === 'online').size,
                    inline: true
                },
                {
                    name: "Ebből bot:",
                    value: message.guild.members.filter(m => m.user.bot == true).size,
                    inline: true
                },
                {
                    name: 'Tulajdonos',
                    value: message.guild.owner.user.tag,
                    inline: true
                },
                {
                    name: "Szerver létrehozva:",
                    value: creationTime.toLocaleDateString(),
                    inline: true
                }
            ]
        }
    });
};

exports.info = {
    syntax: '',
    description: 'Információ a szerverről.'
};
