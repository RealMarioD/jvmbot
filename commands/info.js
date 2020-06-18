const { MessageEmbed } = require('discord.js');
const { getDate } = require('../util');
exports.run = (client, message) => {
    message.channel.send(new MessageEmbed()
        .setColor('#DB6206')
        .setTitle(message.guild.name)
        .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }))
        .setAuthor('JustVidman', 'https://yt3.ggpht.com/a/AGF-l79gTj0WzuZJvH-LDfLpx8iS1Yds282ME2fXUw=s900-mo-c-c0xffffffff-rj-k-no', 'https://www.youtube.com/JustVidman')
        .addField('Tagok száma:', message.guild.members.cache.size, true)
        .addField('Ebből emberi lények száma:', message.guild.members.cache.filter(m => !m.user.bot).size, true)
        .addField('Ebből online:', message.guild.members.cache.filter(m => m.presence.status == 'online' && !m.user.bot).size, true)
        .addField('Tulajdonos:', message.guild.owner.user.toString(), true)
        .addField('Szerver létrehozva:', getDate(new Date(message.guild.createdAt)), true)
    );
};

exports.info = {

    name: 'info',
    category: 'egyéb',
    syntax: '',
    description: 'Információ a szerverről.',
    requiredPerm: null,
    aliases: ['i', 'inf']

};
