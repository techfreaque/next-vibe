import { Div } from "next-vibe/ui/components/div";
import { CodeSnippet } from "next-vibe/ui/components/markdown";
import type { JSX } from "react";

/** Syntax-highlighted code; scrolls horizontally inside its own box. */
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
      <CodeSnippet
        code={code}
        language={language}
        filename={filename ?? language}
        variant="file"
      />
    </Div>
  );
}
