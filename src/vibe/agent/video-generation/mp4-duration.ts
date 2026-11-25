/**
 * Clip length of an MP4/MOV file, read from its `moov/mvhd` box.
 *
 * Billing guard: providers have returned clips far shorter than requested
 * (ModelsLab v6 fallback, prod 2026-11-25: 1.56 s for a 5 s request), and we
 * must never bill seconds that were not delivered. Pure, no dependencies; any
 * layout it cannot read returns undefined (callers then keep the listed price).
 */
export function readMp4DurationSeconds(bytes: Uint8Array): number | undefined {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const findBox = (
    type: string,
    start: number,
    end: number,
  ): { start: number; end: number } | undefined => {
    let offset = start;
    while (offset + 8 <= end) {
      let size = view.getUint32(offset);
      let header = 8;
      if (size === 1) {
        if (offset + 16 > end) {
          return undefined;
        }
        size = Number(view.getBigUint64(offset + 8));
        header = 16;
      } else if (size === 0) {
        size = end - offset;
      }
      if (size < header || offset + size > end) {
        return undefined;
      }
      const boxType = String.fromCharCode(
        bytes[offset + 4] ?? 0,
        bytes[offset + 5] ?? 0,
        bytes[offset + 6] ?? 0,
        bytes[offset + 7] ?? 0,
      );
      if (boxType === type) {
        return { start: offset + header, end: offset + size };
      }
      offset += size;
    }
    return undefined;
  };

  const moov = findBox("moov", 0, bytes.byteLength);
  if (!moov) {
    return undefined;
  }
  const mvhd = findBox("mvhd", moov.start, moov.end);
  if (!mvhd) {
    return undefined;
  }
  const version = bytes[mvhd.start];
  let timescale: number;
  let duration: number;
  if (version === 1) {
    if (mvhd.start + 32 > mvhd.end) {
      return undefined;
    }
    timescale = view.getUint32(mvhd.start + 20);
    duration = Number(view.getBigUint64(mvhd.start + 24));
  } else {
    if (mvhd.start + 20 > mvhd.end) {
      return undefined;
    }
    timescale = view.getUint32(mvhd.start + 12);
    duration = view.getUint32(mvhd.start + 16);
  }
  if (timescale <= 0 || duration <= 0) {
    return undefined;
  }
  return duration / timescale;
}

/**
 * Seconds to bill for a delivered clip: the requested length, unless the file
 * is measurably shorter (more than half a second and 10%), then the measured
 * length rounded up to 0.1 s. Unreadable files keep the requested length.
 */
export function billableVideoSeconds(
  requestedSeconds: number,
  measuredSeconds: number | undefined,
): number {
  if (measuredSeconds === undefined) {
    return requestedSeconds;
  }
  const shortBy = requestedSeconds - measuredSeconds;
  if (shortBy <= 0.5 || measuredSeconds >= requestedSeconds * 0.9) {
    return requestedSeconds;
  }
  return Math.ceil(measuredSeconds * 10) / 10;
}
