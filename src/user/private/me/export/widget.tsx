/**
 * Export My Data Widget
 * Download buttons for the JSON archive and the Markdown summary.
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Download } from "next-vibe/ui/components/icons/Download";
import { downloadFile } from "next-vibe/ui/lib/download";
import type { JSX } from "react";

import {
  useWidgetTranslation,
  useWidgetValue,
} from "../../../../vibe/unified-ui/_shared/use-widget-context";
import type endpoints from "./definition";

export function ExportMyDataWidget(): JSX.Element {
  const value = useWidgetValue<typeof endpoints.GET>();
  const t = useWidgetTranslation<typeof endpoints.GET>();

  if (!value?.json) {
    return <Div />;
  }

  return (
    <Div className="flex flex-col gap-3 p-4">
      <Div className="text-xs text-muted-foreground">
        {t("get.widget.intro")}
      </Div>
      <Div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={(): void =>
            downloadFile(value.jsonFilename, value.json, "application/json")
          }
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          {t("get.widget.downloadJson")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(): void =>
            downloadFile(
              value.markdownFilename,
              value.markdown,
              "text/markdown",
            )
          }
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          {t("get.widget.downloadMarkdown")}
        </Button>
      </Div>
    </Div>
  );
}
