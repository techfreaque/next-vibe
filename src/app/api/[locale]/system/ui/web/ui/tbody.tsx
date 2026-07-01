import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { ReactNode } from "react";

export type TbodyProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Tbody(props: TbodyProps): React.JSX.Element {
  return <tbody {...props} />;
}
