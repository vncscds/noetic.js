import { describe, expect, it } from 'vitest'
import { digest } from '../../src/crypto'

describe('digest', () => {
  it.each([
    {
      input: 'Hello World',
      hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
    },
    {
      input: "admin",
      hash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'

    }
  ])('should correctly hash the input "$input"', async ({ input, hash }) => {
    const digested = await digest(input)
    expect(digested).toBe(hash)
  })

  it('should be deterministic', async () => {
    const [digested1, digest2] = await Promise.all([digest('Hello World'), digest('Hello World')])
    expect(digest2).toBe(digested1)
  })
})