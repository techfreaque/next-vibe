/**
 * Custom Widget for Test Results (CLI/MCP)
 */

import { Box, Text } from "ink";

import type { TestResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: TestResponseOutput | null | undefined;
  };
  fieldName: string;
}

/**
 * Parse bun test summary line like " 116 pass\n 121 fail\n 10 errors\n 538 expect() calls"
 */
function parseSummary(output: string): {
  pass: number;
  fail: number;
  errors: number;
  expects: number;
  files: number;
  testCount: number;
  duration: string;
} {
  const passMatch = output.match(/(\d+)\s+pass/);
  const failMatch = output.match(/(\d+)\s+fail/);
  const errorsMatch = output.match(/(\d+)\s+errors?\b/);
  const expectsMatch = output.match(/(\d+)\s+expect\(\)/);
  const ranMatch = output.match(
    /Ran\s+(\d+)\s+tests?\s+across\s+(\d+)\s+files?.*\[([^\]]+)\]/,
  );

  return {
    pass: passMatch ? parseInt(passMatch[1], 10) : 0,
    fail: failMatch ? parseInt(failMatch[1], 10) : 0,
    errors: errorsMatch ? parseInt(errorsMatch[1], 10) : 0,
    expects: expectsMatch ? parseInt(expectsMatch[1], 10) : 0,
    testCount: ranMatch ? parseInt(ranMatch[1], 10) : 0,
    files: ranMatch ? parseInt(ranMatch[2], 10) : 0,
    duration: ranMatch ? ranMatch[3] : "",
  };
}

/**
 * Extract failure blocks from test output
 */
function extractFailures(output: string): string[] {
  const lines = output.split("\n");
  const failures: string[] = [];
  let current: string[] = [];
  let inFailure = false;

  for (const line of lines) {
    if (line.includes("(fail)")) {
      if (inFailure && current.length > 0) {
        failures.push(current.join("\n"));
      }
      current = [line];
      inFailure = true;
    } else if (inFailure) {
      if (
        line.startsWith("(pass)") ||
        line.startsWith("(fail)") ||
        line.match(/^\s*\d+\s+pass/) ||
        line.match(/^Ran \d+ tests/)
      ) {
        failures.push(current.join("\n"));
        current = [];
        inFailure = false;
        if (line.includes("(fail)")) {
          current = [line];
          inFailure = true;
        }
      } else {
        current.push(line);
      }
    }
  }
  if (inFailure && current.length > 0) {
    failures.push(current.join("\n"));
  }
  return failures;
}

/**
 * Extract unhandled error blocks
 */
function extractUnhandledErrors(output: string): string[] {
  const blocks: string[] = [];
  const lines = output.split("\n");
  let current: string[] = [];
  let inBlock = false;

  for (const line of lines) {
    if (line.includes("# Unhandled error")) {
      if (inBlock && current.length > 0) {
        blocks.push(current.join("\n"));
      }
      current = [line];
      inBlock = true;
    } else if (inBlock) {
      if (line.startsWith("------") && current.length > 2) {
        current.push(line);
        blocks.push(current.join("\n"));
        current = [];
        inBlock = false;
      } else {
        current.push(line);
      }
    }
  }
  if (inBlock && current.length > 0) {
    blocks.push(current.join("\n"));
  }
  return blocks;
}

export function TestResultWidget({ field }: CliWidgetProps): React.JSX.Element {
  const value = field.value;
  if (!value) {
    return <Box />;
  }

  const summary = parseSummary(value.output);
  const allPassed = summary.fail === 0 && summary.errors === 0;
  const durationSec = (value.duration / 1000).toFixed(2);

  const failures = extractFailures(value.output);
  const unhandled = extractUnhandledErrors(value.output);

  return (
    <Box flexDirection="column">
      {/* Show failures first - most important info */}
      {failures.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="red">
            {`Failed Tests (${String(failures.length)})`}
          </Text>
          <Text dimColor>{"─".repeat(50)}</Text>
          {failures.map((block, i) => {
            // Extract the test name from (fail) line
            const nameMatch = block.match(/\(fail\)\s+(.+?)(?:\s+\[\d)/);
            const name = nameMatch ? nameMatch[1] : `Failure ${String(i + 1)}`;
            // Extract error message
            const errorMatch = block.match(/error:\s+(.+)/);
            const errorMsg = errorMatch ? errorMatch[1] : "";

            return (
              <Box
                key={`fail-${String(i)}`}
                flexDirection="column"
                marginLeft={1}
                marginBottom={1}
              >
                <Text color="red">{`  ${String(i + 1)}. ${name}`}</Text>
                {errorMsg && (
                  <Text dimColor wrap="truncate-end">{`     ${errorMsg}`}</Text>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Unhandled errors */}
      {unhandled.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="yellow">
            {`Unhandled Errors (${String(unhandled.length)})`}
          </Text>
          <Text dimColor>{"─".repeat(50)}</Text>
          {unhandled.map((block, i) => {
            const lines = block.split("\n").filter((l) => !l.startsWith("---"));
            const errorLine = lines.find(
              (l) => l.includes("error:") || l.includes("Cannot find"),
            );
            return (
              <Box key={`err-${String(i)}`} marginLeft={1}>
                <Text color="yellow" wrap="truncate-end">
                  {`  ${errorLine ?? lines.slice(1).join(" ").trim()}`}
                </Text>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Summary box */}
      <Box flexDirection="column">
        <Text dimColor>{"─".repeat(50)}</Text>
        <Box>
          <Text bold color={allPassed ? "green" : "red"}>
            {allPassed ? " Tests Passed" : " Tests Failed"}
          </Text>
          <Text dimColor>{`  ${durationSec}s`}</Text>
        </Box>
        <Box marginLeft={1}>
          {summary.pass > 0 && (
            <Text color="green">{`${String(summary.pass)} passed  `}</Text>
          )}
          {summary.fail > 0 && (
            <Text color="red">{`${String(summary.fail)} failed  `}</Text>
          )}
          {summary.errors > 0 && (
            <Text color="yellow">{`${String(summary.errors)} errors  `}</Text>
          )}
          {summary.expects > 0 && (
            <Text dimColor>{`${String(summary.expects)} assertions`}</Text>
          )}
        </Box>
        {summary.testCount > 0 && (
          <Box marginLeft={1}>
            <Text dimColor>
              {`  ${String(summary.testCount)} tests across ${String(summary.files)} files`}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

TestResultWidget.cliWidget = true as const;
