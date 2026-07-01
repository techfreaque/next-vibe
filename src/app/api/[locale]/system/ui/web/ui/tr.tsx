import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { ReactNode } from "react";

export type TrProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Tr(props: TrProps): React.JSX.Element {
  return <tr {...props} />;
}
