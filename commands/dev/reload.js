const { cmdUsage } = require('../../util');

exports.run = (client, message, args) => {
    if(!args.length) return cmdUsage(this, message);
    const commandName = args[0];
    let commandObject = client.commands.get(commandName);
    if(commandObject) {
        client.aliases.forEach((cmdObject, alias) => {
            if(alias.includes(commandName)) commandObject = client.commands.get(cmdObject.info.name);
        });
        if(!commandObject) return message.reply('Ez a parancs nem létezik.');
    }
    let tempFolder;
    switch(commandObject.info.category) {
        case 'pénzverde':
            tempFolder = 'economy';
            break;

        case 'szórakozás':
            tempFolder = 'fun';
            break;

        case 'egyéb':
            tempFolder = 'util';
            break;

        case 'moderáció':
            tempFolder = 'moderation';
            break;

        default:
            tempFolder = commandObject.info.category;
            break;
    }
    delete require.cache[require.resolve(`../../commands/${tempFolder}/${commandName}.js`)];
    client.commands.delete(commandName);
    const props = require(`../../commands/${tempFolder}/${commandName}.js`);
    client.commands.set(commandName, props);
    message.channel.send(`A(z) \`${commandName}\` parancs sikeresen újratöltve!`);
};

exports.info = {

    name: 'reload',
    category: 'dev',
    syntax: '<parancs>',
    description: 'Újratölti a megadott parancsot.',
    requiredPerm: 'developer'

};