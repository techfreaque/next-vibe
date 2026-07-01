/**
 * Custom Widget for Vibe Check Results (React Web)
 */

"use client";

import {
  CodeQualityFilesList,
  CodeQualityIssueList,
  CodeQualitySummary,
} from "next-vibe/tooling/check/_shared/widget-components";
import { Div } from "next-vibe/ui/web/ui/div";
import { useWidgetValue } from "next-vibe/unified-ui/_shared/use-widget-context";

import type definition from "./definition";

export function CheckResultWidget(): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  if (!value) {
    return <Div />;
  }

  return (
    <Div>
      <CodeQualityIssueList
        items={value.items}
        editorUriScheme={value.editorUriSchema}
      />
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
