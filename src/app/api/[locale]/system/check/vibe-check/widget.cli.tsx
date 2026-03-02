/**
 * Custom Widget for Vibe Check Results (CLI/MCP)
 */

import { Box } from "ink";

import {
  type CodeQualityCheckResult,
  CodeQualityFilesListCli,
  CodeQualityIssueListCli,
  CodeQualitySummaryCli,
} from "../_shared/widget-components.cli";

interface CliWidgetProps {
  field: {
    value: CodeQualityCheckResult | null | undefined;
  };
  fieldName: string;
}

export function CheckResultWidget({
  field,
}: CliWidgetProps): React.JSX.Element {
  const value = field.value;
  if (!value) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      {value.items !== undefined && (
        <CodeQualityIssueListCli
          items={value.items}
          editorUriScheme={value.editorUriSchema}
        />
      )}
      <CodeQualityFilesListCli files={value.files} />
      <CodeQualitySummaryCli
        totalIssues={value.totalIssues}
        totalFiles={value.totalFiles}
        totalErrors={value.totalErrors}
        displayedIssues={value.displayedIssues}
        displayedFiles={value.displayedFiles}
      />
    </Box>
  );
}

CheckResultWidget.cliWidget = true as const;
