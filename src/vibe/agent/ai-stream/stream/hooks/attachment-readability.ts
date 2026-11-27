interface UnreadableAttachment {
  index: number;
  bytes: number;
  errorName: string | null;
}

/** Detect a missing or changed backing file without allocating the whole upload. */
export async function findUnreadableAttachment(
  files: readonly File[],
): Promise<UnreadableAttachment | null> {
  for (const [index, file] of files.entries()) {
    try {
      // A browser can keep the selected File after the underlying file becomes
      // unavailable. Reading a small slice checks the handle before navigation.
      await file.slice(0, 1).arrayBuffer();
    } catch (error) {
      return {
        index,
        bytes: file.size,
        errorName: error instanceof Error ? error.name : null,
      };
    }
  }
  return null;
}
