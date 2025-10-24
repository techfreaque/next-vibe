import type { LucideIcon } from "lucide-react-native";

/**
 * NativeWind v5 cssInterop is not available yet
 * TODO: Re-enable when NativeWind v5 stable is released
 */
export function iconWithClassName(icon: LucideIcon): void {
  // cssInterop is not available in NativeWind v5 preview
  // Icons will work but className styling may not apply
  void icon;
}
