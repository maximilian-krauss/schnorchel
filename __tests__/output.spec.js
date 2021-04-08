/// <reference types="jest" />
jest.mock('path')
jest.mock('fs')

const { writeToOutputDirectory } = require('./../source/output')
const fs = require('fs')
const path = require('path')

const exampleSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'FooBaer Set',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      uuid: { type: 'string' },
      orderId: { type: 'number' }
    }
  }
}
const exampleConfig = {
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
  rabbitMq: {
    exchangeName: 'snorkel'
  },
  output: {
    directory: './putput',
    schemaSerializer: async (schema) => JSON.stringify(schema, null, 2),
    schemaFileNameFormatter: (schemaName, config) => `${config.rabbitMq.exchangeName}-${schemaName}.json`
  }
}
describe('output', () => {
  it('should generate serialized output files in the right folder', async () => {
    await writeToOutputDirectory('foobaer', exampleSchema, exampleConfig)

    expect(fs.promises.mkdir).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            "resolved-path",
            Object {
              "recursive": true,
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `)

    expect(path.join).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            "resolved-path",
            "snorkel-foobaer.json",
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": "joined-path",
          },
        ],
      }
    `)

    expect(fs.promises.writeFile).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            "joined-path",
            "{
        \\"$schema\\": \\"http://json-schema.org/draft-04/schema#\\",
        \\"title\\": \\"FooBaer Set\\",
        \\"type\\": \\"array\\",
        \\"items\\": {
          \\"type\\": \\"object\\",
          \\"properties\\": {
            \\"uuid\\": {
              \\"type\\": \\"string\\"
            },
            \\"orderId\\": {
              \\"type\\": \\"number\\"
            }
          }
        }
      }",
            Object {
              "encoding": "utf8",
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `)
  })
})
