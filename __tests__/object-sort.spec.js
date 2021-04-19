/// <reference types="jest" />

const { sortByKey } = require('../source/object-sort')

describe('object-sort', () => {
  describe('sortByKey', () => {
    const testCases = {
      simple: {
        input: { b: 2, c: 3, a: 1 },
        expectedOutput: { a: 1, b: 2, c: 3 }
      },
      advanced: {
        input: {
          c: { b: 2, a: 1 },
          b: 2,
          a: { b: 2, a: 1 }
        },
        expectedOutput: {
          a: { a: 1, b: 2 },
          b: 2,
          c: { a: 1, b: 2 }
        }
      },
      withArrays: {
        input: {
          b: { b: 2, a: 1 },
          a: [
            { b: 2, c: 3, a: 1 },
            { f: 3, e: 2, d: 1 }
          ]
        },
        expectedOutput: {
          a: [
            { b: 2, c: 3, a: 1 },
            { d: 1, e: 2, f: 3 }
          ],
          b: { a: 1, b: 2 }
        }
      }
    }

    for (const testName in testCases) {
      test(testName, () => {
        const testCase = testCases[testName]
        const output = sortByKey(testCase.input)
        expect(output).toStrictEqual(testCase.expectedOutput)
      })
    }
  })
})
