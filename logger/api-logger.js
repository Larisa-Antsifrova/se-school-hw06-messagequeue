const amqp = require('amqplib');

class ApiLogger {
  constructor(logger, amqpUrl) {
    this.logger = logger;
    this.amqpUrl = amqpUrl;
    this.exchangeName = 'logs';
  }

  async emitLog(logType, logMessage) {
    const connection = await amqp.connect(this.amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertExchange(this.exchangeName, 'direct', {
      durable: false,
    });

    channel.publish(this.exchangeName, logType, Buffer.from(logMessage));

    console.log(`Sent. Log type: ${logType}. Log message: ${logMessage}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  }

  async consumeLog(logType = 'error') {
    const connection = await amqp.connect(this.amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertExchange(this.exchangeName, 'direct', {
      durable: false,
    });
    const q = await channel.assertQueue('', { exclusive: true });

    this.logger.info(`Waiting for messages in queue: ${q.queue}`);

    channel.bindQueue(q.queue, this.exchangeName, logType);

    channel.consume(
      q.queue,
      message => {
        if (message.content) {
          this.logger[logType](message.content.toString());
        }
      },
      { noAck: true },
    );
  }
}

module.exports = ApiLogger;
