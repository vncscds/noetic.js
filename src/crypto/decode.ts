const textDecoder = new TextDecoder();

/**
 * Decodes a buffer into a UTF-8 string.
 *
 * @param buffer - The buffer to decode (Uint8Array, ArrayBuffer, etc.)
 * @param options - Optional decoding options
 * @param options.stream - If true, additional data will follow in subsequent calls
 * @returns The decoded UTF-8 string
 *
 * @example
 * ```typescript
 * // Basic usage
 * const buffer = new Uint8Array([72, 101, 108, 108, 111])
 * decode(buffer)
 * // Returns: 'Hello'
 *
 * // With streaming (for chunked data)
 * const chunk1 = decode(data1, { stream: true })
 * const chunk2 = decode(data2, { stream: false })
 *
 * // Decoding emojis
 * const emoji = new Uint8Array([240, 159, 152, 128])
 * decode(emoji)
 * // Returns: '😀'
 * ```
 *
 * @throws {TypeError} If the buffer is not a valid BufferSource
 * @throws {TypeError} If the buffer contains invalid UTF-8 sequences
 */
export default function decode(buffer: AllowSharedBufferSource, options?: TextDecodeOptions): string {
  return textDecoder.decode(buffer, options)
}