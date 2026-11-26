"use client";

import { createContext, useContext } from "react";

import type { DescriptionStyle } from "../../../_shared/field-config-types";

/**
 * How much field help a surrounding form shows:
 * - `false`: each field's own theme decides
 * - `true` (compact): no tooltip icons at all (dense filter bars, inline editors)
 * - `"informative"`: the admin form template; tooltip icons stay, but only
 *   where the description says more than the label (see FieldInfoTooltip)
 */
export const CompactFieldHelpContext = createContext<boolean | "informative">(
  false,
);

export function useFormFieldDescriptionStyle(
  style: DescriptionStyle,
  keepDescription = false,
): DescriptionStyle | undefined {
  const compact = useContext(CompactFieldHelpContext);
  if (compact === "informative") {
    return keepDescription && style === "tooltip" ? "inline" : style;
  }
  if (compact && style === "tooltip") {
    return keepDescription ? "inline" : undefined;
  }
  return style;
}
