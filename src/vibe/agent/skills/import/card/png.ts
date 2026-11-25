/** Read Tavern metadata, keeping only raster chunks for a public avatar. */
import { promisify } from "node:util";
import { crc32, inflate } from "node:zlib";

import { CARD_MAX_BYTES, CARD_MAX_JSON_BYTES } from "./limits";

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const MAX_CHUNKS = 2048;
const MAX_EDGE = 4096;
const MAX_PIXELS = 4 * 1024 * 1024;
const MAX_CARD_CHUNK_BYTES = Math.ceil(CARD_MAX_JSON_BYTES / 3) * 4 + 1024;
const inflateRaster = promisify(inflate);

interface PngAvatar {
  bytes: Buffer;
  compressed: Buffer[];
  maxRasterBytes: number;
}

export function isPng(bytes: Buffer): boolean {
  return bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
}

function readCardChunk(
  type: string,
  body: Buffer,
  cards: Map<string, string>,
): void {
  if (body.length > MAX_CARD_CHUNK_BYTES) {
    return;
  }
  const keywordEnd = body.indexOf(0);
  if (keywordEnd !== 4 && keywordEnd !== 5) {
    return;
  }
  const keyword = body.toString("latin1", 0, keywordEnd).toLowerCase();
  if (keyword !== "chara" && keyword !== "ccv3") {
    return;
  }
  if (type === "tEXt") {
    cards.set(keyword, body.toString("latin1", keywordEnd + 1));
  } else if (body[keywordEnd + 1] === 0 && body[keywordEnd + 2] === 0) {
    // Only read uncompressed iTXt. Do not inflate card metadata.
    const languageEnd = body.indexOf(0, keywordEnd + 3);
    if (languageEnd >= 0) {
      const translatedEnd = body.indexOf(0, languageEnd + 1);
      if (translatedEnd >= 0) {
        cards.set(keyword, body.toString("utf8", translatedEnd + 1));
      }
    }
  }
}

export function readCardPng(bytes: Buffer): {
  cards: Map<string, string>;
  avatar: PngAvatar;
} | null {
  if (!isPng(bytes) || bytes.length > CARD_MAX_BYTES) {
    return null;
  }

  const raster: Buffer[] = [PNG_SIGNATURE];
  const compressed: Buffer[] = [];
  const cards = new Map<string, string>();
  let offset = PNG_SIGNATURE.length;
  let maxRasterBytes = 0;
  let palette = false;
  let transparent = false;
  for (
    let count = 0;
    count < MAX_CHUNKS && offset + 12 <= bytes.length;
    count++
  ) {
    const length = bytes.readUInt32BE(offset);
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > bytes.length) {
      return null;
    }
    const type = bytes.toString("latin1", offset + 4, start);
    const body = bytes.subarray(start, end);
    if (crc32(bytes.subarray(offset + 4, end)) !== bytes.readUInt32BE(end)) {
      return null;
    }

    const chunk = bytes.subarray(offset, end + 4);
    if (count === 0) {
      if (type !== "IHDR" || length !== 13) {
        return null;
      }
      const width = body.readUInt32BE(0);
      const height = body.readUInt32BE(4);
      if (
        width === 0 ||
        height === 0 ||
        width > MAX_EDGE ||
        height > MAX_EDGE ||
        width * height > MAX_PIXELS
      ) {
        return null;
      }
      // At most four 16-bit channels and two filter bytes per row, including Adam7.
      maxRasterBytes = (width * 8 + 2) * height + 8;
      raster.push(chunk);
    } else if (
      type === "PLTE" &&
      !palette &&
      compressed.length === 0 &&
      length <= 768
    ) {
      palette = true;
      raster.push(chunk);
    } else if (
      type === "tRNS" &&
      !transparent &&
      compressed.length === 0 &&
      length <= 256
    ) {
      transparent = true;
      raster.push(chunk);
    } else if (type === "IDAT") {
      compressed.push(body);
      raster.push(chunk);
    } else if (type === "IEND") {
      if (length !== 0 || compressed.length === 0) {
        return null;
      }
      raster.push(chunk);
      return {
        cards,
        avatar: { bytes: Buffer.concat(raster), compressed, maxRasterBytes },
      };
    } else if (type === "tEXt" || type === "iTXt") {
      readCardChunk(type, body, cards);
    } else if ((bytes[offset + 4] & 0x20) === 0) {
      // An unknown or misplaced critical chunk changes how the image decodes.
      return null;
    }
    offset = end + 4;
  }
  return null;
}

/** Refuse oversized or broken raster data before handing the PNG to storage. */
export async function validatePngAvatar(
  avatar: PngAvatar,
): Promise<Buffer | null> {
  try {
    const data = await inflateRaster(Buffer.concat(avatar.compressed), {
      maxOutputLength: avatar.maxRasterBytes,
    });
    return data.length > 0 ? avatar.bytes : null;
  } catch {
    return null;
  }
}
