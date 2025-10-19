import { describe, expect, it } from 'vitest'
import { encode } from '../../src/crypto'

describe('encode', () => {
  it('should return an instance of Uint8Array', () => {
    const encoded = encode('Hello World!')
    expect(encoded).toBeInstanceOf(Uint8Array)
  })

  it('should correctly encode the string to UTF-8 bytes', () => {
    const encoded = encode('Hello World!')
    const expectedBytes = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
    expect(encoded).toStrictEqual(expectedBytes)
  })

  it('should return an empty Uint8Array for empty strings', () => {
    const encoded = encode('')
    const expectedBytes = new Uint8Array([])
    expect(encoded).toStrictEqual(expectedBytes)
  })
})