exports.run = (client, message, args) => {
    if(!args || args.length < 1) return message.reply('Meg kell adnod a parancsot amit reloadolni akarsz.');
    const commandName = args[0];
    if(!client.commands.has(commandName)) {
      return message.reply('Ez a parancs nem létezik.');
    }
    const tempCmd = client.commands.get(commandName);
    let tempFolder;
    switch(tempCmd.info.category) {
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
        tempFolder = tempCmd.info.category;
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