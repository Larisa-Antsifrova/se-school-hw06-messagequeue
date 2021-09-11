require('dotenv').config();
const bunyan = require('bunyan');

const ApiLogger = require('../logger/api-logger');

const { RABBITMQ_URL } = process.env;

const logger = bunyan.createLogger({ name: 'web-bit', level: 'debug' });

const apiLogger = new ApiLogger(logger, RABBITMQ_URL);

module.exports = apiLogger;
