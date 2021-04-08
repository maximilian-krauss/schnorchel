import merge from 'lodash.merge'
import toMS from 'ms'
import { ok } from 'assert'
import { resolve } from 'path'
import GenerateSchema from 'generate-schema'

import { connectToRabbitMq } from './source/rabbit.js'
import defaultConfig from './source/default-config.js'
import { sleep } from './source/helper.js'
import { writeToOutputDirectory } from './source/output.js'

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

export async function startListening (pathToConfig) {
  const { default: overwrites } = await import(pathToConfig)
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

export async function startApplication () {
  const [,, pathToConfig] = process.argv
  ok(pathToConfig, 'Path to config needs to be specified')

  const resolvedPath = resolve(pathToConfig)
  await startListening(resolvedPath)
}

startApplication()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
