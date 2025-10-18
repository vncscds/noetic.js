export default function getTypeTag<T>(target: T): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}