/**
 * Pixel size of an encoded image, read from its header (PNG, JPEG, WebP, GIF).
 * Pure: no decoding, no dependency. Used so the generate_image result states
 * the size the provider really delivered, not the size that was asked for.
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

function readPng(bytes: Uint8Array, view: DataView): ImageDimensions | null {
  // 8-byte signature, then the IHDR chunk: length(4) "IHDR"(4) width(4) height(4)
  if (
    bytes.length < 24 ||
    bytes[0] !== 0x89 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x4e ||
    bytes[3] !== 0x47
  ) {
    return null;
  }
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function readGif(bytes: Uint8Array, view: DataView): ImageDimensions | null {
  if (
    bytes.length < 10 ||
    bytes[0] !== 0x47 ||
    bytes[1] !== 0x49 ||
    bytes[2] !== 0x46
  ) {
    return null;
  }
  return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
}

function readWebp(bytes: Uint8Array, view: DataView): ImageDimensions | null {
  // "RIFF" size "WEBP" then a VP8 / VP8L / VP8X chunk
  if (
    bytes.length < 30 ||
    bytes[0] !== 0x52 ||
    bytes[1] !== 0x49 ||
    bytes[8] !== 0x57 ||
    bytes[9] !== 0x45
  ) {
    return null;
  }
  const chunk = String.fromCharCode(
    bytes[12] ?? 0,
    bytes[13] ?? 0,
    bytes[14] ?? 0,
    bytes[15] ?? 0,
  );
  if (chunk === "VP8X") {
    // 24-bit little-endian canvas width-1 / height-1 at 24 / 27
    const width =
      1 +
      ((bytes[24] ?? 0) | ((bytes[25] ?? 0) << 8) | ((bytes[26] ?? 0) << 16));
    const height =
      1 +
      ((bytes[27] ?? 0) | ((bytes[28] ?? 0) << 8) | ((bytes[29] ?? 0) << 16));
    return { width, height };
  }
  if (chunk === "VP8L") {
    // signature 0x2f at 20, then 14-bit width-1 and 14-bit height-1
    const b0 = bytes[21] ?? 0;
    const b1 = bytes[22] ?? 0;
    const b2 = bytes[23] ?? 0;
    const b3 = bytes[24] ?? 0;
    const width = 1 + (((b1 & 0x3f) << 8) | b0);
    const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
    return { width, height };
  }
  if (chunk === "VP8 ") {
    // key frame start code 9d 01 2a at 23, then 14-bit width / height
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    };
  }
  return null;
}

function readJpeg(bytes: Uint8Array, view: DataView): ImageDimensions | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return null;
  }
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1] ?? 0;
    // SOF0..SOF15 carry the frame size, except DHT (c4), JPG (c8), DAC (cc)
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return {
        height: view.getUint16(offset + 5),
        width: view.getUint16(offset + 7),
      };
    }
    // Standalone markers without a length
    if (
      marker === 0xd8 ||
      marker === 0x01 ||
      (marker >= 0xd0 && marker <= 0xd7)
    ) {
      offset += 2;
      continue;
    }
    offset += 2 + view.getUint16(offset + 2);
  }
  return null;
}

/** Width/height from the image header, null when the format is unknown or truncated. */
export function readImageDimensions(
  buffer: Uint8Array,
): ImageDimensions | null {
  const view = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  const dimensions =
    readPng(buffer, view) ??
    readJpeg(buffer, view) ??
    readWebp(buffer, view) ??
    readGif(buffer, view);
  if (!dimensions || !(dimensions.width > 0) || !(dimensions.height > 0)) {
    return null;
  }
  return dimensions;
}
