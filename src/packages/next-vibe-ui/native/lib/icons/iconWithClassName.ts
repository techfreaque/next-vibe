import type { LucideIcon } from "lucide-react-native";
// @ts-expect-error - cssInterop is not exported in types but exists at runtime
import { cssInterop } from "nativewind";

export function iconWithClassName(icon: LucideIcon): void {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}
