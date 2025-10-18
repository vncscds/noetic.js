/**
 * Lookup table for converting bytes (0-255) to hexadecimal strings.
 *
 * Pre-computed table that maps each possible byte value to its
 * two-character lowercase hexadecimal representation (e.g., 0 → '00', 255 → 'ff').
 *
 * Using a lookup table is faster than calling `toString(16).padStart(2, '0')`
 * repeatedly, especially when converting multiple bytes (e.g., in hash functions).
 *
 * @constant
 * @type {string[]}
 *
 * @example
 * ```typescript
 * HEX_TABLE[0]   // '00'
 * HEX_TABLE[15]  // '0f'
 * HEX_TABLE[255] // 'ff'
 *
 * // Usage in hash conversion
 * const bytes = new Uint8Array([72, 101, 108, 108, 111])
 * const hex = bytes.map(byte => HEX_TABLE[byte]).join('')
 * // Returns: '48656c6c6f'
 * ```
 */
export const HEX_TABLE = Array.from({ length: 256 }, (_, idx) => {
  return idx.toString(16).padStart(2, '0')
})