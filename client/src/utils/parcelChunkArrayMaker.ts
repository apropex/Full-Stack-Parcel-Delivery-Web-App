import type { iParcelResponse } from "@/types";

export default function parcelChunkArrayMaker(
  array: iParcelResponse[],
  chunkSize: number
): iParcelResponse[][] {
  const result: iParcelResponse[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
}
