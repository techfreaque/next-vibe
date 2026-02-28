/**
 * Custom Widget for TypeScript Check Results (React Web)
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";

import {
  CodeQualityFilesList,
  CodeQualityIssueList,
  CodeQualitySummary,
} from "../_shared/widget-components";
import type definition from "./definition";
import type { TypecheckResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: TypecheckResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function CheckResultWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = field.value;
  if (!value) {
    return <Div />;
  }

  return (
    <Div>
      <CodeQualityIssueList items={value.items} />
      <CodeQualityFilesList files={value.files} />
      <CodeQualitySummary
        totalIssues={value.totalIssues}
        totalFiles={value.totalFiles ?? 0}
        totalErrors={value.totalErrors}
        displayedIssues={value.displayedIssues}
        displayedFiles={value.displayedFiles}
      />
    </Div>
  );
}
