import type { StyleType } from "../utils/style-type";

export type BrProps = {
  id?: string;
} & StyleType;

export function Br(props: BrProps): React.JSX.Element {
  return <br {...props} />;
}
