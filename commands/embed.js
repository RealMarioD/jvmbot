exports.run = (client, message, args) => {

  if(args.length == 0) {

    message.channel.send({embed: {color: 0xff0000, title: 'Helytelen használat. `.parancsok embed`'}});
    return;

  }

  message.channel.send({

    embed: {

      color: parseInt(args[0]),
      thumbnail: {

    		url: args[1] == 'no-icon' ? '' : args[1]

    	},
      description: args.slice(2).join(' ')

    }

  });

}

exports.info = {

  syntax: '<HEX szín (pl. 0xFF0000)> <embed ikon (link a képhez) vagy ha nem akarod írd be: `no-icon`> <embed szöveg>',
  description: 'Discord embed küldése.\nAlapvető discord formázási karakterek működnek!'

}
