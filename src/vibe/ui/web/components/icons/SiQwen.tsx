import { SiQwen as ReactSimpleIcon } from "@icons-pack/react-simple-icons";
import type { JSX } from "react";

/**
 * Qwen (Alibaba) models logo from Simple Icons. Simple Icons titles it "QWen"; the brand is "Qwen".
 */
export function SiQwen({ className }: { className?: string }): JSX.Element {
  // eslint-disable-next-line i18next/no-literal-string -- brand name
  return <ReactSimpleIcon className={className} title="Qwen" />;
}
