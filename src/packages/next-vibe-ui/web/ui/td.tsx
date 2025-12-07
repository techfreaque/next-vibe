import type { ReactNode } from "react";
import type { StyleType } from "../utils/style-type";

export type TdProps = {
  children?: ReactNode;
  id?: string;
  colSpan?: number;
  rowSpan?: number;
} & StyleType;

export function Td(props: TdProps): React.JSX.Element {
  return <td {...props} />;
}
