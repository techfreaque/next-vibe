/**
 * Custom Widget for Vibe Check Results — ALL platforms.
 *
 * One widget for web, CLI (fast renderer + interactive Ink), MCP and native, per
 * docs/patterns/widget.md: platform differences live in next-vibe-ui, which the
 * Bun plugin swaps to its CLI implementation (Div→Box, Span→Text, className
 * translated by tailwind-to-ink).
 *
 * Two things this widget must respect:
 *
 * 1. It renders PROGRESSIVE data. The repository emits "check-progress" events
 *    carrying partial results while the three checkers run, so every field can be
 *    absent or half-filled. `phases` drives the live status rows; `isComplete`
 *    marks the final frame. There is no separate loading widget — an in-flight
 *    frame and the final frame are the same component with different data.
 *
 * 2. The CLI fast renderer has NO layout engine: `gap`, `alignItems`,
 *    `justifyContent`, `flexGrow` and `width` are ignored. Spacing is therefore
 *    written as explicit strings and columns are aligned with padEnd, never with
 *    a gap utility.
 *
 *    A bare Div stacks its children on both surfaces; `className="flex"` puts
 *    them in a row on both. Every inline row here says so explicitly.
 */

// oxlint-disable oxlint-plugin-i18n/no-literal-string -- Inline endpoint: this
// widget renders literal copy by design (see definition.ts, createEndpoint from
// core/definition/create). There is no scope to translate against.
"use client";

import { Div } from "next-vibe/ui/ui/div";
import { AlertTriangle } from "next-vibe/ui/ui/icons/AlertTriangle";
import { BarChart3 } from "next-vibe/ui/ui/icons/BarChart3";
import { CheckCircle } from "next-vibe/ui/ui/icons/CheckCircle";
import { CircleDashed } from "next-vibe/ui/ui/icons/CircleDashed";
import { DotFilledIcon } from "next-vibe/ui/ui/icons/DotFilledIcon";
import { Folder } from "next-vibe/ui/ui/icons/Folder";
import { Info } from "next-vibe/ui/ui/icons/Info";
import { Minus } from "next-vibe/ui/ui/icons/Minus";
import { XCircle } from "next-vibe/ui/ui/icons/XCircle";
import { ExternalLink } from "next-vibe/ui/ui/link";
import { Span } from "next-vibe/ui/ui/span";
import { H3 } from "next-vibe/ui/ui/typography";
import { useMemo } from "react";

import {
  useIsMcp,
  useWidgetResponseOnly,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "../../unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "../../unified-ui/widgets/form-fields/number-field/widget";
import { TagsFieldWidget } from "../../unified-ui/widgets/form-fields/tags-field/widget";
import { FormAlertWidget } from "../../unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "../../unified-ui/widgets/interactive/submit-button/widget";
import type definition from "./definition";

// ── Types ──────────────────────────────────────────────────

interface CodeQualityItem {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

interface FileStats {
  file: string;
  errors: number;
  warnings: number;
  total: number;
}

interface CheckPhase {
  id: string;
  tool: string;
  status: "pending" | "running" | "done" | "failed" | "skipped";
  issues?: number;
  errors?: number;
  durationMs?: number;
}

/** Inline icon sizing — ignored by the CLI icons, sizes the SVG on web. */
const ICON_SIZE = "inline h-4 w-4";

const SEVERITY_ORDER: Record<CodeQualityItem["severity"], number> = {
  error: 0,
  warning: 1,
  info: 2,
};

function SeverityIcon({
  severity,
}: {
  severity: CodeQualityItem["severity"];
}): React.JSX.Element {
  if (severity === "error") {
    return <XCircle className={ICON_SIZE} />;
  }
  if (severity === "warning") {
    return <AlertTriangle className={ICON_SIZE} />;
  }
  return <Info className={ICON_SIZE} />;
}

/**
 * Severity colour. Matches the original CLI exactly: red / yellow / blue —
 * `info` is blue, not the cyan a `text-primary` token would produce.
 */
function severityClass(severity: CodeQualityItem["severity"]): string {
  return severity === "error"
    ? "text-destructive"
    : severity === "warning"
      ? "text-warning"
      : "text-blue-500";
}

function sortBySeverity(items: CodeQualityItem[]): CodeQualityItem[] {
  return [...items].toSorted(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
}

function groupByFile(
  items: CodeQualityItem[] | null | undefined,
): Map<string, CodeQualityItem[]> {
  const groups = new Map<string, CodeQualityItem[]>();
  if (!items) {
    return groups;
  }
  for (const item of items) {
    const existing = groups.get(item.file) ?? [];
    existing.push(item);
    groups.set(item.file, existing);
  }
  return groups;
}

/**
 * Absolute path for the editor URI. `process.cwd()` exists on CLI/SSR but not in
 * the browser bundle, so a relative path is left as-is there rather than
 * throwing — the link is a local-editor convenience, not core content.
 */
function toAbsolutePath(file: string): string {
  if (file.startsWith("/") || /^[A-Za-z]:/.test(file)) {
    return file;
  }
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return `${process.cwd()}/${file}`;
  }
  return file;
}

// ── Request Form ────────────────────────────────────────────

/**
 * The request form: paths, filters and flags.
 *
 * Rendered from `field.children` with one widget per field, the same way
 * contact/widget.tsx does it — a custom widget owns its whole subtree, so the
 * framework does not render these for us.
 *
 * Hidden when `responseOnly` (the non-interactive CLI frame and MCP both render
 * results only) — there is nothing to submit there.
 */
function CheckRequestForm({
  requestFields: children,
}: {
  requestFields: (typeof definition.POST)["fields"]["children"];
}): React.JSX.Element {
  const responseOnly = useWidgetResponseOnly();
  const isMcp = useIsMcp();

  if (responseOnly === true || isMcp) {
    return <></>;
  }

  return (
    <Div className="flex flex-col gap-2">
      <FormAlertWidget field={{}} />
      <TagsFieldWidget fieldName="paths" field={children.paths} />
      <TagsFieldWidget fieldName="filter" field={children.filter} />
      <NumberFieldWidget fieldName="limit" field={children.limit} />
      <NumberFieldWidget fieldName="page" field={children.page} />
      <NumberFieldWidget fieldName="timeout" field={children.timeout} />
      <BooleanFieldWidget
        fieldName="summaryOnly"
        field={children.summaryOnly}
      />
      <BooleanFieldWidget fieldName="extensive" field={children.extensive} />
      <BooleanFieldWidget fieldName="strict" field={children.strict} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{
          // Literal copy: this endpoint uses createEndpoint from
          // core/definition/create, which has no translation scope.
          text: "Run Check",
          loadingText: "Checking...",
          icon: "wrench",
          variant: "primary",
        }}
      />
    </Div>
  );
}

// ── Phase List (progress) ───────────────────────────────────

/**
 * Live status of the three checkers. Rendered from `phases`, which arrives via
 * the "check-progress" event before the request resolves.
 *
 * Hidden on MCP entirely: an agent wants the result, not a progress animation,
 * and every wasted line is wasted context.
 */
function CheckPhaseList({
  phases,
  isComplete,
}: {
  phases: CheckPhase[] | null | undefined;
  isComplete?: boolean;
}): React.JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp || !Array.isArray(phases) || phases.length === 0) {
    return <></>;
  }

  const toolWidth = Math.max(...phases.map((phase) => phase.tool.length));

  return (
    <Div className="mb-2">
      {phases.map((phase) => {
        const done = phase.status === "done";
        const skipped = phase.status === "skipped";
        // A tool that died is never a checkmark. Rendering "✓ 0 issues" for a
        // crashed checker is what made an out-of-memory abort read as a clean
        // tree - the row has to say the tool did not run.
        const failed = phase.status === "failed";
        // A leg that RAN and found errors is not a pass either. `✓ TypeScript`
        // has printed beside "4 issues" and beside "63 issues" — the glyph was
        // decorative, tracking only "did this finish", and readers took the
        // checkmark as the verdict and stopped there. The marker now tracks the
        // OUTCOME: green only when the tool ran and found nothing.
        const foundErrors = done && (phase.errors ?? 0) > 0;
        const markerClass =
          failed || foundErrors
            ? "text-destructive"
            : done
              ? "text-success"
              : skipped
                ? "text-muted-foreground"
                : "text-primary";

        const detail = failed
          ? "FAILED TO RUN - result unknown, NOT a pass"
          : done
            ? `${phase.issues ?? 0} issue${phase.issues === 1 ? "" : "s"}`
            : skipped
              ? "skipped"
              : "running";

        return (
          <Div key={phase.id} className="flex">
            {/* Icons inherit colour from the wrapping Span: ink Text inherits
                from its parent, and Lucide SVGs use currentColor. */}
            <Span className={markerClass}>
              {failed || foundErrors ? (
                <XCircle className={ICON_SIZE} />
              ) : done ? (
                <CheckCircle className={ICON_SIZE} />
              ) : skipped ? (
                <Minus className={ICON_SIZE} />
              ) : (
                <CircleDashed className={ICON_SIZE} />
              )}
            </Span>
            <Span>{` ${phase.tool.padEnd(toolWidth + 2)}`}</Span>
            <Span
              className={
                failed || (done && (phase.errors ?? 0) > 0)
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {/* Trailing space, not just padEnd: the failure detail is longer
                  than the pad width, so padding alone is a no-op and the
                  duration collides with the text ("NOT a pass1.4s"). */}
              {`${detail} `.padEnd(15)}
            </Span>
            {phase.durationMs !== undefined && (
              <Span className="text-muted-foreground">
                {`${(phase.durationMs / 1000).toFixed(1)}s`}
              </Span>
            )}
          </Div>
        );
      })}
      {/* Separator only while in flight — the final frame flows into results. */}
      {!isComplete && <Span className="text-muted-foreground"> </Span>}
    </Div>
  );
}

// ── Issue List ──────────────────────────────────────────────

/** Only rendered once every checker has reported — see CheckResultWidget. */
function CodeQualityIssueList({
  items,
  editorUriScheme,
}: {
  items: CodeQualityItem[] | null | undefined;
  editorUriScheme?: string;
}): React.JSX.Element {
  const isMcp = useIsMcp();
  const scheme = editorUriScheme || "vscode://file/";

  const groupedItems = useMemo(() => groupByFile(items), [items]);

  if (!items || items.length === 0) {
    if (isMcp) {
      return <Span>{"No issues found"}</Span>;
    }
    // Colour lives on the Span, never on the Div: a CLI Div maps to an Ink Box,
    // which cannot carry text style, so `text-*` on a Div is silently dropped
    // there while working fine on web. A Span wrapping the icon colours it too
    // (nested Ink Text inherits; Lucide SVGs use currentColor).
    return (
      <Span className="text-success">
        <CheckCircle className={ICON_SIZE} />
        {` ${"No issues found"}`}
      </Span>
    );
  }

  return (
    <Div>
      {[...groupedItems.entries()].map(([file, fileItems]) => (
        <Div key={file}>
          {/* One bold Span wrapping the row, mirroring the original's
              chalk.bold(...) around the whole header. Nested Spans add the blue
              underlined path and the dimmed count. A bold Div would be dropped
              on CLI — an Ink Box carries no text style. */}
          <Span className="font-bold">
            <DotFilledIcon className={ICON_SIZE} />
            <Span className="text-blue-500 underline">{` ${file}`}</Span>
            <Span className="text-muted-foreground">
              {` (${fileItems.length} item${fileItems.length !== 1 ? "s" : ""})`}
            </Span>
          </Span>

          {sortBySeverity(fileItems).map((item, idx) => {
            const line = item.line ?? 1;
            const column = item.column ?? 1;
            const position = `${line}:${column}`;
            const editorUrl = `${scheme}${toAbsolutePath(item.file)}:${line}:${column}`;

            return (
              <Div key={idx} className="flex">
                <Span>{"  "}</Span>
                {isMcp ? (
                  // No hyperlink for agents: a bare path:line:col is what an AI
                  // can act on, and OSC-8 escapes would just be noise.
                  <Span>{position}</Span>
                ) : (
                  // Plain blue, no underline — the original wrapped the OSC-8
                  // hyperlink in chalk.blue only. Without hyperlink support the
                  // bare `12:5` is useless, so fall back to the full path.
                  <ExternalLink
                    href={editorUrl}
                    className="text-blue-500 no-underline"
                    unlinkedLabel={`${item.file}:${line}:${column}`}
                  >
                    {position}
                  </ExternalLink>
                )}
                <Span className={severityClass(item.severity)}>
                  {" "}
                  <SeverityIcon severity={item.severity} />
                  {` ${item.severity}`}
                </Span>
                <Span>{` ${item.message}`}</Span>
                {/* Undimmed, matching the original: the rule id is what you
                    search for when silencing a lint, not incidental detail. */}
                {item.rule && <Span>{` [${item.rule}]`}</Span>}
              </Div>
            );
          })}
          <Span> </Span>
        </Div>
      ))}
    </Div>
  );
}

// ── Files List ──────────────────────────────────────────────

function CodeQualityFilesList({
  files,
  totalFiles,
}: {
  files: FileStats[] | null | undefined;
  totalFiles?: number;
}): React.JSX.Element {
  const isMcp = useIsMcp();

  // MCP gets no file roll-up at all. Every path here already appeared as a group
  // header above, so the section is pure duplication — and paths are the most
  // token-expensive thing in the response.
  if (isMcp || !Array.isArray(files) || files.length === 0) {
    return <></>;
  }

  const remainingFiles = Math.max(
    0,
    (totalFiles ?? files.length) - files.length,
  );

  return (
    <Div className="mt-1">
      <H3 className="font-bold">{"Affected files"}</H3>
      {files.map((fileEntry, idx) => (
        <Div key={idx} className="flex">
          {/* Indent outside the styled span so the underline covers only the
              path, not the leading whitespace. */}
          <Span>{"  "}</Span>
          <Span className="text-blue-500 underline">{fileEntry.file}</Span>
          {fileEntry.errors > 0 && (
            <Span className="text-destructive">
              {` ${fileEntry.errors} error${fileEntry.errors !== 1 ? "s" : ""}`}
            </Span>
          )}
          {fileEntry.warnings > 0 && (
            <Span className="text-warning">
              {` ${fileEntry.warnings} warning${fileEntry.warnings !== 1 ? "s" : ""}`}
            </Span>
          )}
          {fileEntry.errors === 0 &&
            fileEntry.warnings === 0 &&
            fileEntry.total > 0 && (
              <Span className="text-muted-foreground">
                {` ${fileEntry.total} issue${fileEntry.total !== 1 ? "s" : ""}`}
              </Span>
            )}
        </Div>
      ))}
      {remainingFiles > 0 && (
        <Span className="text-muted-foreground">
          {`... and ${remainingFiles} more file(s)`}
        </Span>
      )}
    </Div>
  );
}

// ── Summary ─────────────────────────────────────────────────

function CodeQualitySummary({
  totalIssues,
  totalFiles,
  totalErrors,
  displayedIssues,
  displayedFiles,
}: {
  totalIssues: number;
  totalFiles: number;
  totalErrors?: number;
  displayedIssues?: number;
  displayedFiles?: number;
}): React.JSX.Element {
  const isMcp = useIsMcp();

  if (totalIssues === 0 && totalFiles === 0) {
    return <></>;
  }

  const of = "of";
  const filesDisplay =
    displayedFiles !== undefined && displayedFiles < totalFiles
      ? `${displayedFiles} ${of} ${totalFiles}`
      : String(totalFiles);
  const issuesDisplay =
    displayedIssues !== undefined && displayedIssues < totalIssues
      ? `${displayedIssues} ${of} ${totalIssues}`
      : String(totalIssues);

  // MCP: no icons, no padding — plain labelled lines, cheapest to read.
  if (isMcp) {
    return (
      <Div className="mt-1">
        <Span>{"Summary"}</Span>
        {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator */}
        <Span>──────────────────────────────────────────────────</Span>
        <Div>
          <Span>{`${"Files"}: ${filesDisplay}`}</Span>
        </Div>
        <Div>
          <Span>{`${"Issues"}: ${issuesDisplay}`}</Span>
        </Div>
        {totalErrors !== undefined && totalErrors > 0 && (
          <Div>
            <Span>{`${"Errors"}: ${totalErrors}`}</Span>
          </Div>
        )}
      </Div>
    );
  }

  return (
    <Div className="mt-1 px-1">
      {/* Span, not H3: the heading sits inline beside its icon. A block-level
          heading would break the row onto two lines on CLI. */}
      <Div className="flex">
        <BarChart3 className={ICON_SIZE} />
        <Span className="font-bold">{` ${"Summary"}`}</Span>
      </Div>
      {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator */}
      <Span>──────────────────────────────────────────────────</Span>
      <Div className="flex">
        <Folder className={ICON_SIZE} />
        <Span>{` ${"Files"}: ${filesDisplay}`}</Span>
      </Div>
      <Div className="flex">
        <AlertTriangle className={ICON_SIZE} />
        <Span>{`  ${"Issues"}: ${issuesDisplay}`}</Span>
      </Div>
      {totalErrors !== undefined && totalErrors > 0 && (
        <Span className="text-destructive">
          <XCircle className={ICON_SIZE} />
          {` ${"Errors"}: ${totalErrors}`}
        </Span>
      )}
    </Div>
  );
}

// ── Main Widget ──────────────────────────────────────────────

interface CheckResultWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function CheckResultWidget({
  field,
}: CheckResultWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  const form = <CheckRequestForm requestFields={field.children} />;

  if (!value) {
    // Before the first run there is no result yet — the form IS the page.
    return <Div>{form}</Div>;
  }

  // While checks are in flight, the phase rows ARE the whole UI. Results are
  // only meaningful once every checker has reported: a partial list gets
  // reordered by whichever checker lands next, and an empty one would read as a
  // clean bill of health that a later checker then contradicts.
  if (value.isComplete === false) {
    return (
      <Div>
        {form}
        <CheckPhaseList phases={value.phases} isComplete={false} />
      </Div>
    );
  }

  return (
    <Div>
      {form}
      <CheckPhaseList phases={value.phases} isComplete={true} />
      {value.items !== undefined && (
        <CodeQualityIssueList
          items={value.items}
          editorUriScheme={value.editorUriSchema}
        />
      )}
      <CodeQualityFilesList files={value.files} totalFiles={value.totalFiles} />
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

CheckResultWidget.cliWidget = true as const;
