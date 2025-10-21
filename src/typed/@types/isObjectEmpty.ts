export default function isObjectEmpty(target: Record<PropertyKey, unknown>): boolean {
  return Object.keys(target).length === 0;
}