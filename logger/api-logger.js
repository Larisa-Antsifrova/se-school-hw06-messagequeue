const amqp = require('amqplib');

class ApiLogger {
  constructor(logger, amqpUrl) {
    this.logger = logger;
    this.amqpUrl = amqpUrl;
    this.exchangeName = 'logs';
  }

  async publishLog(logType, logMessage) {
    const [channel, connection] = await this.establishConnection();
    channel.publish(this.exchangeName, logType, Buffer.from(logMessage));

    this.closeConnection(connection);
  }

  async consumeLog(...logTypes) {
    const [channel] = await this.establishConnection();

    const q = await channel.assertQueue('', { exclusive: true });

    logTypes.forEach(logType =>
      channel.bindQueue(q.queue, this.exchangeName, logType),
    );

    channel.consume(
      q.queue,
      message => {
        if (message.content) {
          this.logger[message.fields.routingKey](message.content.toString());
        }
      },
      { noAck: true },
    );
  }

  async establishConnection() {
    const connection = await amqp.connect(this.amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertExchange(this.exchangeName, 'direct', {
      durable: false,
    });

    return [channel, connection];
  }

  closeConnection(connection) {
    setTimeout(() => {
      connection.close();
    }, 500);
  }
}

module.exports = ApiLogger;
