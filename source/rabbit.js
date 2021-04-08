import { connect } from 'amqplib'
import { ok } from 'assert'

const logger = console

export async function connectToRabbitMq ({ uri, exchangeName, exchangeType, routingKey, queueName = undefined }, processMessageFn) {
  ok(uri)
  ok(processMessageFn)
  ok(exchangeName)
  ok(exchangeType)

  const connection = await connect(uri)
  const channel = await connection.createChannel()
  const { queue } = await channel.assertQueue(queueName, { autoDelete: true })
  const { exchange } = await channel.assertExchange(exchangeName, exchangeType)

  await channel.bindQueue(queue, exchange, routingKey)

  channel.consume(queue, message => {
    if (message === null) return

    processMessageFn(message)
      .catch(error => {
        logger.error(error)
      })
      .finally(() => channel.ack(message))
  })

  return {
    close: async function () {
      await channel.close()
      await connection.close()
    }
  }
}
