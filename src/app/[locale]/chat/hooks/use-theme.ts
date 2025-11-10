import { storage } from "next-vibe-ui/lib/storage";
import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "chat-theme";
const DEFAULT_THEME: Theme = "dark";

/**
 * Hook for managing theme state with storage persistence
 * @returns Tuple of [theme, toggleTheme]
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    setMounted(true);
    async function loadTheme(): Promise<void> {
      const stored = await storage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", stored === "dark");
        }
      }
    }
    void loadTheme();
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      if (mounted) {
        async function saveTheme(): Promise<void> {
          await storage.setItem(STORAGE_KEY, newTheme);
        }
        void saveTheme();
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle(
            "dark",
            newTheme === "dark",
          );
        }
      }
      return newTheme;
    });
  }, [mounted]);

  return [theme, toggleTheme];
}
