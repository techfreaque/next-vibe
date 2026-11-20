/** Resolve the instance identity from its configured URL and preview mode. */
export function deriveDefaultSelfInstanceId(
  appUrl: string,
  isPreviewMode: boolean,
): "atlas" | "hermes" | "thea" {
  if (isPreviewMode) {
    return "hermes";
  }

  try {
    const { hostname } = new URL(appUrl);
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "thea";
    }
  } catch {
    // An invalid URL has no remote instance identity.
  }

  return "atlas";
}
