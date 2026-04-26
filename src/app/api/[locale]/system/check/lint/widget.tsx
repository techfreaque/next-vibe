/**
 * Custom Widget for ESLint Results (React Web)
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";

import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import {
  CodeQualityFilesList,
  CodeQualityIssueList,
  CodeQualitySummary,
} from "../_shared/widget-components";
import type definition from "./definition";

export function CheckResultWidget(): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  if (!value) {
    return <Div />;
  }

  return (
    <Div>
      <CodeQualityIssueList items={value.items} />
      <CodeQualityFilesList files={value.files} />
      <CodeQualitySummary
        totalIssues={value.totalIssues}
        totalFiles={value.totalFiles}
        totalErrors={value.totalErrors}
        displayedIssues={value.displayedIssues}
        displayedFiles={value.displayedFiles}
      />
    </Div>
  );
}
