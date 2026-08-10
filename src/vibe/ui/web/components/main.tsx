import type { ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

export type MainProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Main(props: MainProps): React.JSX.Element {
  return <main {...props} />;
}
