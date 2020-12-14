const Discord = require('discord.js');
const modCases = require('./assets/modCases.json');
const { client } = require('./jvm');
const fs = require('fs');

function log(moderationType, moderator, punished, reason, timeout) {

    const thisCaseNumber = modCases.total + 1;

    if(!reason) reason = 'Nincs megadva.';

    const logMessage = new Discord.MessageEmbed()
        .setAuthor(`${thisCaseNumber}. ügy | ${moderationType} | ${punished.user.tag}`, punished.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField('Tag', punished, true)
        .addField('Moderátor', moderator, true)
        .addField('Eljárás oka', reason, true)
        .setFooter(`ID: ${punished.id}`)
        .setTimestamp();

    switch(moderationType) {
        case 'Kick': case 'Ban':
            logMessage.setColor('#EE2500');
            break;

        case 'Mute':
            logMessage.setColor('#FF6000');
            handleMute(Date.now(), timeout, punished);
            break;

        case 'Unmute':
            logMessage.setColor('#FFCC00');
            handleUnmute(punished);
            break;

        default:
            logMessage.setColor('#FFED00');
            break;
    }

    if(timeout) logMessage.addField('Hossz', `${timeout / 1000 / 60} perc`, true);

    client.channels.cache.get(client.config.modLogChannel).send(logMessage)
    .then(msg => {
        modCases.cases[thisCaseNumber] = {
            modType: moderationType,
            mod: moderator.tag,
            user: punished.tag,
            msgID: msg.id
        };
        modCases.total++;
        fs.writeFileSync('./assets/modCases.json', JSON.stringify(modCases, null, 2));
    });

}

function handleUnmute(punished) {
    delete modCases.mutes[punished.id];
    fs.writeFileSync('./assets/modCases.json', JSON.stringify(modCases, null, 2));
}

function handleMute(muteWhen, muteDuration, muteWho) {
    modCases.mutes[muteWho.id] = {
        mutedAt: muteWhen,
        muteLength: muteDuration
    };
    fs.writeFileSync('./assets/modCases.json', JSON.stringify(modCases, null, 2));
    setTimeout(() => {
        muteWho.roles.remove(client.config.muteRole);
        log('Unmute', client.user.toString(), muteWho, 'Auto');
    }, muteDuration);
}

function initMute() {

    if(Object.entries(modCases.mutes).length) {

        for(const [key, value] of Object.entries(modCases.mutes)) {

            const currentUser = client.guilds.cache.get(client.config.serverID).members.cache.get(key);
            if(!currentUser) break;

            if(value.mutedAt + value.muteDuration >= Date.now()) currentUser.roles.remove(client.config.muteRole);
            else {
                setTimeout(() => {
                    currentUser.roles.remove(client.config.muteRole);
                    log('Unmute', client.user.toString(), currentUser, 'Auto');
                }, Date.now() - (value.mutedAt + value.muteDuration));
            }

        }
    }

}

module.exports = {
    log: log,
    initMute: initMute
};