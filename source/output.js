const path = require('path')
const fs = require('fs')

async function writeToOutputDirectory (schemaName, schema, config) {
  const {
    logger,
    output: {
      directory,
      schemaSerializer,
      schemaFileNameFormatter
    }
  } = config
  const destinationDirectory = path.resolve(directory)
  await fs.promises.mkdir(destinationDirectory, { recursive: true })

  const serializedSchema = await schemaSerializer(schema)
  const filename = schemaFileNameFormatter(schemaName, config)

  await fs.promises.writeFile(
    path.join(destinationDirectory, filename),
    serializedSchema,
    { encoding: 'utf8' }
  )

  logger.info('Schema saved to disk', { filename, destinationDirectory })
}

module.exports = {
  writeToOutputDirectory
}
