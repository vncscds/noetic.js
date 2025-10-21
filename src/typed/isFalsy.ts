
type Falsy = false | 0 | -0 | 0n | '' | null | undefined

export default function isFalsy(target: unknown): target is Falsy {
  return !target
}