import { Div } from "next-vibe/ui/components/div";
import type { JSX } from "react";

import { StaticCodeFile } from "../../_components/static-code";
import { StaticCodeCopy } from "../../_components/static-code-copy";

/**
 * Syntax-highlighted code; scrolls horizontally inside its own box.
 * Highlighted where the article renders (the server in Next); only the copy
 * button hydrates.
 */
export function ArticleCode({
  code,
  language,
  filename,
}: {
  code: string;
  language: string;
  filename?: string;
}): JSX.Element {
  return (
    <Div className="min-w-0 max-w-full">
      <StaticCodeFile
        code={code}
        language={language}
        filename={filename ?? language}
        header={<StaticCodeCopy code={code} />}
      />
    </Div>
  );
}
