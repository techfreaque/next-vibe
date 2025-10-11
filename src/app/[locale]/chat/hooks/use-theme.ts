import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "chat-theme";
const DEFAULT_THEME: Theme = "dark";

/**
 * Hook for managing theme state with localStorage persistence
 * @returns Tuple of [theme, toggleTheme]
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      if (mounted) {
        localStorage.setItem(STORAGE_KEY, newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
      return newTheme;
    });
  }, [mounted]);

  return [theme, toggleTheme];
}

