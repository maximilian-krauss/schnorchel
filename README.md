# schnorchel

![schnorchel logo](logo.png)

JSON Schema generator for your messy RabbitMQ.

## What's the problem?

Ever had the _joy_ in consuming from a RabbitMq exchange which is not maintained by youself?

For web APIs you could ask for a swagger file but for message queues there is no real established standard.

So there is that blackhole of different messages which can pop up of that queue.

## schnorchel to the rescue

`schnorchel` listens for a specified amount of time on your exchange of choice and differentiates on your 

## Usage

You will need a `config.js` file which tells schnorchel from where it should get the messages, how to tell them apart and where to put them.

For reaons of actuality, please refer to the [default-config](/source/default-config.js) for all available configuration options. You can overwrite every one of them with your own `config.js`

## Example configuration

This is the most simple configuration you could have in order to operate `schnorchel`:

```js
module.exports = {
  logger: console,

  rabbitMq: {
    uri: 'amqps://username:password@localhost:5671',
    exchangeName: 'some-exchange',
    exchangeType: 'topic'
  },
  listener: {
    timeout: '10sec',
    schemaNameFormatter: message => message?.payload?.eventType
  }
}
```
