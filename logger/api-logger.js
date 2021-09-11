const amqp = require('amqplib');

class ApiLogger {
  constructor(logger, amqpUrl) {
    this.logger = logger;
    this.amqpUrl = amqpUrl;
  }

  emitLog() {}

  consumeLog() {}
}

module.exports = ApiLogger;
