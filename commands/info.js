exports.run = (client, message, args) => {

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

          name: 'Tagok',
          value: message.guild.memberCount

        },

        {

          name: 'Online',
          value: message.guild.members.filter(u => u.presence.status === 'online').size

        },

        {

          name: 'Tulajdonos',
          value: message.guild.owner.user.tag

        },

        {

          name: 'Rangok',
          value: message.guild.roles.map(r => r.name).length

        }

      ]

    }

  });

}

exports.info = {

  syntax: '',
  description: 'Információ a szerverről'

}
