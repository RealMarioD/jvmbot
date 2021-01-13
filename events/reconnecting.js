const { getDate } = require('../util.js');
module.exports = () => {
    console.log(`RECONNECTING... @ ${getDate()}`);
};