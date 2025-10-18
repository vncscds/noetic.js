const DIGEST_ALGORITHM = 'SHA-256'

export default async function digest(input: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(input)
  const digestedData = await crypto.subtle.digest(DIGEST_ALGORITHM, msgBuffer)
  const hashView = new Uint8Array(digestedData)

  let hex = ''
  for (let idx = 0; idx < hashView.byteLength; idx++) {
    hex += hashView[idx].toString(16).padStart(2, '0')
  }

  return hex
}