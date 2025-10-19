import { beforeEach, describe, expect, it } from 'vitest';
import { freezeAsync } from '../../src/object/freezeAsync';

describe('freezeAsync', () => {
  let target: { key: string };
  let targetFrozen: Readonly<{ key: string }>;

  beforeEach(async () => {
    target = { key: 'value' }
    targetFrozen = await freezeAsync(target)
  })

  it('should resolve with an object marked as frozen', () => {
    expect(Object.isFrozen(targetFrozen)).toBe(true);
    expect(targetFrozen).toBe(target);
  });

  it('should throw an error when trying to modify the resolved object', () => {
    const attemptToChange = () => {
      // @ts-expect-error
      targetFrozen.key = 'newValue';
    };

    expect(attemptToChange).toThrow(TypeError);
  });
});