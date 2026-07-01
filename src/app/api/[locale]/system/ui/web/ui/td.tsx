import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { ReactNode } from "react";

export type TdProps = {
  children?: ReactNode;
  id?: string;
  colSpan?: number;
  rowSpan?: number;
} & StyleType;

export function Td(props: TdProps): React.JSX.Element {
  return <td {...props} />;
}
