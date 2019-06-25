exports.run = (client, message, args) => {

    if (args.length === 0) {

        error(message.channel);
        return;

    }

    var colour;
    if (args[0].startsWith("0x")) {
        colour = parseInt(args[0])
    }
    else {
        colour = parseInt(colourNameToHex(args[0]));
        if (!colour) {
            error(message.channel);
            return;
        }
    }
    message.channel.send({

        embed: {

            color: colour,
            thumbnail: {

                url: args[1] === 'no-icon' ? '' : args[1]

            },
            description: args.slice(2).join(' ')

        }

    });

};

exports.info = {

    syntax: '<HEX szín (pl. 0xFF0000)> <embed ikon (link a képhez) vagy ha nem akarod írd be: `no-icon`> <embed szöveg>',
    description: 'Discord embed küldése.\nAlapvető discord formázási karakterek működnek!'

};
