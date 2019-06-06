exports.run = (client, message, args) => {

  var helpEmbed = {

    color: 0x56f442,
    title: 'Parancsok',
    fields: []

  };

  if(args.length == 0) {

    const fs = require('fs');

    fs.readdir(`./commands/`, (err, commandFiles) => {

      commandFiles.forEach(commandFile => {

        let cmd = require(`./${commandFile}`);

        helpEmbed.fields.push({

          name: `\`\`${client.config.prefix}${commandFile.replace('.js', '')} ${cmd.info.syntax}\`\``,
          value: cmd.info.description

        });

      });

      message.channel.send({embed: helpEmbed});

    });

  }else {

    try {

      let commandFile = require(`./${args[0].toLowerCase()}.js`);
      message.channel.send({embed: {color: 0x56f442, title: `\`\`${client.config.prefix}${args[0].toLowerCase()}\`\``, description: (commandFile.info.syntax == '' ? `` : `Értékek: ${commandFile.info.syntax}\n`) + `Információ: ${commandFile.info.description}`}});

    }catch(e) {

      message.channel.send({embed: {color: 0xff0000, title: `Nem találtam a parancsot. \n\`\`${client.config.prefix}parancsok\`\``}});

    }

  }

}

exports.info = {

  syntax: '<parancs>',
  description: 'Visszaadja az összes parancsot'

}
