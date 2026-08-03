/**
 * Terminal Icon component.
 *
 * Substituted for icon-component.tsx by the CLI build. The web component lazy-
 * loads a Lucide SVG, which a terminal cannot draw — it rendered as nothing,
 * leaving a bare gap wherever a widget placed an icon (most visibly inside
 * buttons). CliIcon maps the same registry key to its terminal glyph.
 *
 * Keeping the swap here means widgets keep using `<Icon icon="wrench" />` and
 * never branch on platform themselves.
 */

import type { JSX } from "react";

import { CliIcon } from "./cli-icons";
import type { IconKey } from "./icons";

export const Icon = ({
  icon,
  className,
}: {
  icon: IconKey;
  className?: string;
}): JSX.Element => {
  // className carries Tailwind sizing/spacing that has no meaning on a terminal;
  // spacing between an icon and its label is handled by the CLI primitives.
  void className;
  return <CliIcon icon={icon} />;
};
