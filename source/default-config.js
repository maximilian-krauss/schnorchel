module.exports = {
  // Required, uses the same interfaces which is exposed by `console`
  logger: undefined,

  // RabbitMq connection configuration
  rabbitMq: {
    uri: '',
    exchangeName: '',
    exchangeType: 'topic',
    routingKey: '#',
    messageDeserializer: async message => JSON.parse(message.content.toString())
  },
  listener: {
    // Amount of time the Schnorchel should be listening to the exchange.
    // You can use human readable time values like 30sec, 5min, 1h etc
    timeout: '5min',

    // Amount of samples to store for each different schema
    numberOfSamplesPerSchema: 20,

    // Method to determine the name of the schema. Must return a string
    // If return value is falsy, the message will be skipped
    schemaNameFormatter: (deserializedMessage, routingKey) => { throw new Error('Please implement the schemaNameFormatter method') }
  },
  output: {
    // The directory to output the generated schema files. This is relative to the working directory
    directory: './output',

    schemaSerializer: async schema => JSON.stringify(schema, null, 2),

    schemaFileNameFormatter: (schemaName, config) => `${config.rabbitMq.exchangeName}-${schemaName}.json`
  }
}
