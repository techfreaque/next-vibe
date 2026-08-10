import type { ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

export type TrProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Tr(props: TrProps): React.JSX.Element {
  return <tr {...props} />;
}
