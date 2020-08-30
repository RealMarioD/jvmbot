exports.run = (client, message, args) => {

    const toKick = [];

    message.guild.members.fetch()
        .then(members => getMembers(members));

    function getMembers(members) {
        members.forEach(m => {
            if(!args.includes(m.user.id) && m.roles.cache.size < 2) {
                toKick.push(m);
            }
        });
        message.channel.send(`**Igazolatlanok: [${toKick.length}]**${toKick.map(user => `\n> ${user.user.tag}`)}\n\nKick? \`igen || nem\``)
            .then(msg => {
                msg.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000 })
                    .then(collected => handleAnswer(collected));
            });
    }

    function handleAnswer(collected) {
        const answer = collected.first().content.replace(/ /g, '');
        if(answer == 'igen' ||
        answer == 'i' ||
        answer == 'yes' ||
        answer == 'y') {
            message.channel.send('Folyamatban...')
                .then(msg => {
                    toKick.forEach(member => {
                        member.kick('Nem igazolt.');
                    });
                    msg.edit(`${toKick.length} tag kirúgva!`);
                });
        }
        else {
            message.channel.send('Visszavonva.');
        }
    }

};

exports.info = {

    name: 'kickinactive',
    category: 'moderáció',
    syntax: '<kivételek ID-je>',
    description: 'Kirúgja az összes igazolatlan tagot.',
    requiredPerm: 'moderator'

};
