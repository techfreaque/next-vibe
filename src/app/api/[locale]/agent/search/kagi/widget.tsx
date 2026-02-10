/**
 * Custom Widget for Kagi Search Results
 */

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ExternalLink, Sparkles } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { withValue } from "../../../system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { MarkdownWidget } from "../../../system/unified-interface/unified-ui/widgets/display-only/markdown/react";
import type definition from "./definition";
import type { KagiSearchGetResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: KagiSearchGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for Kagi search results
 */
export function KagiSearchResultsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = field.value;
  const children = field.children;
  const t = useWidgetTranslation();
  const disabled = useWidgetDisabled();

  const references = value?.references ?? [];

  // Process output to replace reference markers 【1】 with markdown links [1](url)
  const output = value?.output
    ? value.output.replace(/【(\d+)】/g, (match, num) => {
        const index = parseInt(num, 10) - 1;
        const ref = references[index];
        return ref ? `[${num}](${ref.url})` : match;
      })
    : undefined;

  const hasResults = output || references.length > 0;

  return (
    <Div className="flex flex-col gap-4">
      {/* Search Form */}
      {!disabled ? (
        <Div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
          <TextFieldWidget fieldName="query" field={children.query} />
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget
            field={{
              text: "app.api.agent.search.kagi.get.submitButton.label",
              loadingText:
                "app.api.agent.search.kagi.get.submitButton.loadingText",
              icon: "search",
              variant: "primary",
            }}
          />
        </Div>
      ) : (
        <TextFieldWidget fieldName="query" field={children.query} />
      )}

      {/* Results */}
      {hasResults && (
        <Div className="flex flex-col gap-4">
          {/* AI Answer Section */}
          {output && (
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="p-0">
                <Div className="flex items-center gap-2 px-4 py-3 border-b border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/20">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <Span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    {t("app.api.agent.search.kagi.get.response.output.title")}
                  </Span>
                </Div>
                <Div className="p-4">
                  <MarkdownWidget
                    fieldName="output"
                    field={withValue(children.output, output ?? null, null)}
                  />
                </Div>
              </CardContent>
            </Card>
          )}

          {/* References Section */}
          {references.length > 0 && (
            <Div className="flex flex-col gap-2">
              <Div className="text-sm font-semibold text-muted-foreground px-1">
                {t("app.api.agent.search.kagi.get.response.references.title")}
              </Div>
              <Div className="flex flex-col gap-2">
                {references.map((ref, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <CardContent className="p-0">
                      <Link
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 hover:bg-muted/50 transition-colors"
                      >
                        <Div className="flex items-start gap-3">
                          <Div className="rounded-lg bg-muted p-2 mt-0.5">
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </Div>
                          <Div className="flex-1 min-w-0">
                            <Div className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                              {ref.title}
                            </Div>
                            {ref.snippet && (
                              <Div className="text-xs text-muted-foreground line-clamp-2">
                                {ref.snippet}
                              </Div>
                            )}
                            <Div className="text-xs text-muted-foreground mt-2 truncate">
                              {new URL(ref.url).hostname}
                            </Div>
                          </Div>
                        </Div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </Div>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
