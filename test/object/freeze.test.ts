import { describe, expect, it } from 'vitest'
import { freeze } from '../../src/object/freeze'

describe('freeze', () => {
  const target = { key: 'value' }
  const targetFrozen = freeze(target)

  it('should freeze object', () => {
    expect(Object.isFrozen(targetFrozen)).toBe(true)
    expect(targetFrozen).toBe(targetFrozen)
  })

  it('should thrown an error when modifying a frozen object', () => {
    const attemptChange = () => {
      // @ts-expect-error
      targetFrozen.key = 'updated value'
    }

    expect(attemptChange).toThrow(TypeError)
  })
})