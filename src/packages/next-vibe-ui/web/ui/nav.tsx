import type { ReactNode } from "react";
import type { StyleType } from "../utils/style-type";

export type NavProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Nav(props: NavProps): React.JSX.Element {
  return <nav {...props} />;
}
