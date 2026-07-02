import type { ReactNode } from "react";

import type { StyleType } from "../../web/utils/style-type";

export type TbodyProps = {
  children?: ReactNode;
  id?: string;
} & StyleType;

export function Tbody(props: TbodyProps): React.JSX.Element {
  return <tbody {...props} />;
}
