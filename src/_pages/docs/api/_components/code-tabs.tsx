/**
 * Code block with language tabs and a copy button.
 *
 * Server half: highlights every tab with `StaticCode` where the page renders
 * (the server in Next) and hands the finished panels to the interactive
 * `CodeTabsFrame`. Highlighting in the browser used to ship Prism with every
 * grammar and re-tokenize ~90 blocks during hydration on this page.
 */

import type { JSX } from "react";

import { StaticCode } from "../../../_components/static-code";
import { CodeTabsFrame } from "./code-tabs-frame";

export { CopyButton } from "./code-tabs-frame";

export interface CodeTab {
  /** Tab label, e.g. "curl", "Python". */
  label: string;
  language: string;
  code: string;
}

function highlightedPanel(tab: CodeTab): JSX.Element {
  return <StaticCode code={tab.code} language={tab.language} />;
}

export function CodeTabs({
  tabs,
  title,
  copyLabel,
  copiedLabel,
  wrapLabel,
  wrapByDefault,
  className,
}: {
  tabs: CodeTab[];
  /** Shown left of the tabs, e.g. "Request" or "Response 200". */
  title?: string;
  copyLabel: string;
  copiedLabel: string;
  /** Label of the wrap-long-lines toggle. */
  wrapLabel: string;
  /** Initial wrap state. Unset: long one-liners start wrapped on phones. */
  wrapByDefault?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <CodeTabsFrame
      tabs={tabs.map((tab) => ({
        label: tab.label,
        code: tab.code,
        panel: highlightedPanel(tab),
      }))}
      title={title}
      copyLabel={copyLabel}
      copiedLabel={copiedLabel}
      wrapLabel={wrapLabel}
      wrapByDefault={wrapByDefault}
      className={className}
    />
  );
}
