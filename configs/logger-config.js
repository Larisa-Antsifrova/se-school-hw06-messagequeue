const bunyan = require('bunyan');

const logger = bunyan.createLogger({ name: 'web-bit', level: 'debug' });

module.exports = logger;
