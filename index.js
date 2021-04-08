const merge = require('lodash.merge')
const toMS = require('ms')
const GenerateSchema = require('generate-schema')

const { connectToRabbitMq } = require('./source/rabbit.js')
const defaultConfig = require('./source/default-config.js')
const { sleep } = require('./source/helper.js')
const { writeToOutputDirectory } = require('./source/output.js')

function addSampleToCollection (sample, schemaName, collection, { numberOfSamplesPerSchema }) {
  if (!collection[schemaName]) {
    collection[schemaName] = []
  }
  if (collection[schemaName].length > numberOfSamplesPerSchema) {
    return
  }
  collection[schemaName].push(sample)
}

function samplesToSchema (schemaName, samples) {
  return GenerateSchema.json(schemaName, samples)
}

async function startListening (pathToConfig) {
  const overwrites = require(pathToConfig)
  const config = merge({}, defaultConfig, overwrites)
  const collectedSchemas = {}

  const { close } = await connectToRabbitMq(config.rabbitMq, async function (message) {
    const payload = await config.rabbitMq.messageDeserializer(message)
    const { fields: { routingKey } } = message
    const schemaName = config.listener.schemaNameFormatter(payload, routingKey)
    if (!schemaName) {
      return
    }

    addSampleToCollection(payload, schemaName, collectedSchemas, config.listener)
  })

  await sleep(toMS(config.listener.timeout))

  await close()

  for (const sampleName in collectedSchemas) {
    const schema = samplesToSchema(sampleName, collectedSchemas[sampleName])
    await writeToOutputDirectory(sampleName, schema, config)
  }
}

module.exports = {
  startListening
}
