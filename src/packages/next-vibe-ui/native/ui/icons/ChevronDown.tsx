import type { LucideProps } from "lucide-react-native";
import { ChevronDown as ChevronDownIcon } from "lucide-react-native";

import { iconWithClassName } from "./iconWithClassName";

iconWithClassName(ChevronDownIcon);

// Export with className support
export const ChevronDown = ChevronDownIcon as React.ComponentType<
  LucideProps & { className?: string }
>;
