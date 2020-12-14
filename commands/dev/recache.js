const { MessageEmbed } = require('discord.js');
const { getEmoji } = require('../../util');
exports.run = (client, message) => {

    const loading = getEmoji('loading');

    const cacheEmbed = new MessageEmbed()
        .setTitle('Cache-k frissítése...')
        .addField('GuildMembers', loading);

    message.channel.send(cacheEmbed)
    .then(msg => {
        message.guild.members.fetch({ cache: true })
            .then(() => {
                cacheEmbed.fields[0].value = '✅';
                msg.edit(cacheEmbed);
            })
            .catch(() => {
                cacheEmbed.fields[0].value = '❌';
                msg.edit(cacheEmbed);
            });
    });
};

exports.info = {

    name: 'recache',
    category: 'dev',
    syntax: '',
    description: 'Újratölti a GuildMembers cache-t.',
    requiredPerm: 'developer'

};
