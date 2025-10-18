import getTypeTag from "@/utils/getTypeTag"
import type { TagTypes as TagType } from "./@types/TagTypes.type"

export default function isType(target: unknown, type: TagType): boolean {
  return getTypeTag(target) === type
}