exports.run = (client, message, args) => {
    if(!args || args.length < 1) return message.reply('Meg kell adnod a parancsot amit reloadolni akarsz.');
    const commandName = args[0];
    if(!client.commands.has(commandName)) {
      return message.reply('Ez a parancs nem létezik.');
    }
    delete require.cache[require.resolve(`./${commandName}.js`)];
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.channel.send(`A(z) \`${commandName}\` parancs sikeresen újratöltve!`);
};

exports.info = {

  name: 'reload',
  syntax: '<parancs>',
  description: 'Újratölti a megadott parancsot.',
  requiredPerm: 'developer'

};