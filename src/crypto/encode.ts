const textEncoder = new TextEncoder()

/**
 * Encodes a string into UTF-8 bytes.
 *
 * @param data - The string to encode
 * @returns A Uint8Array containing the UTF-8 encoded bytes
 *
 * @example
 * ```typescript
 * encode('Hello')
 * // Returns: Uint8Array(5) [72, 101, 108, 108, 111]
 *
 * encode('café')
 * // Returns: Uint8Array(5) [99, 97, 102, 195, 169]
 *
 * encode('😀')
 * // Returns: Uint8Array(4) [240, 159, 152, 128]
 * ```
 */
export default function encode(data: string): Uint8Array {
  return textEncoder.encode(data)
}