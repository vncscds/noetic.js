import { describe, expect, it } from 'vitest'
import { decode, encode } from '../../src/crypto'

describe('decode', () => {
  it('should return an empty string when decoding an empty input', () => {
    const encoded = encode('')
    const decoded = decode(encoded)
    expect(decoded).toBe('')
  })
  it('should correctly decode a non-empty string', () => {
    const encoded = encode('Hello World!')
    const decoded = decode(encoded)
    expect(decoded).toBe('Hello World!')
  })
})