import path from 'path'
import fs from 'fs'

export async function writeToOutputDirectory (schemaName, schema, config) {
  const {
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
}
