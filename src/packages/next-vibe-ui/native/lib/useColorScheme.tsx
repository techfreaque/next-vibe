import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme(): {
  colorScheme: "dark" | "light";
  isDarkColorScheme: boolean;
  setColorScheme: (scheme: "dark" | "light") => void;
  toggleColorScheme: () => void;
} {
  const nativewindColorScheme = useNativewindColorScheme();
  const { colorScheme } = nativewindColorScheme;
  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme: (scheme: "dark" | "light"): void => {
      nativewindColorScheme.setColorScheme(scheme);
    },
    toggleColorScheme: (): void => {
      nativewindColorScheme.toggleColorScheme();
    },
  };
}
