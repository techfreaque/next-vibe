import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme(): {
  colorScheme: "dark" | "light";
  isDarkColorScheme: boolean;
  setColorScheme: (scheme: "dark" | "light") => void;
  toggleColorScheme: () => void;
} {
  const nativewindColorScheme = useNativewindColorScheme();
  const { colorScheme } = nativewindColorScheme;
  const normalizedColorScheme: "dark" | "light" = colorScheme === "light" ? "light" : "dark";
  return {
    colorScheme: normalizedColorScheme,
    isDarkColorScheme: normalizedColorScheme === "dark",
    setColorScheme: (scheme: "dark" | "light"): void => {
      nativewindColorScheme.setColorScheme(scheme);
    },
    toggleColorScheme: (): void => {
      nativewindColorScheme.toggleColorScheme();
    },
  };
}
