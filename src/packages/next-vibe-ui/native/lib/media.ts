export function getUserAgent(): string {
  return "React Native";
}

export function getLanguage(): string {
  return "en-US";
}

export async function getMicrophoneStream(): Promise<null> {
  return null;
}

export async function getGeolocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
} | null> {
  const Geolocation = await import("@react-native-community/geolocation");
  return new Promise((resolve) => {
    Geolocation.default.getCurrentPosition(
      (pos) => resolve(pos.coords),
      () => resolve(null),
    );
  });
}
