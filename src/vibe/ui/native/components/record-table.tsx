import type { JSX } from "react";

import type { RecordTableProps } from "../../web/components/record-table";

export type { RecordTableProps } from "../../web/components/record-table";

export function RecordTable({ compact }: RecordTableProps): JSX.Element {
  return <>{compact}</>;
}
