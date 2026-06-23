export function getUserAgent(): string {
  return `Node.js/${process.version} (${process.platform})`;
}

export function getLanguage(): string {
  return process.env["LANG"]?.split(".")[0]?.replace("_", "-") ?? "en-US";
}

export async function getMicrophoneStream(): Promise<null> {
  return null;
}

export function getGeolocation(): Promise<null> {
  return Promise.resolve(null);
}
