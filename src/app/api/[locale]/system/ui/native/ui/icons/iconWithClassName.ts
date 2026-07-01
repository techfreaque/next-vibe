import type { LucideIcon } from "lucide-react-native";
import { styled } from "nativewind";

/**
 * Apply NativeWind className support to Lucide icons
 * Uses styled() from nativewind to enable className processing
 */
export function iconWithClassName(icon: LucideIcon): LucideIcon {
  // Apply styled() wrapper to enable className support and return it
  return styled(icon) as LucideIcon;
}
