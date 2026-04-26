/**
 * Custom Widget for Kagi Search Results
 */

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ExternalLink as ExternalLinkIcon } from "next-vibe-ui/ui/icons/ExternalLink";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import { withValue } from "../../../system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { MarkdownWidget } from "../../../system/unified-interface/unified-ui/widgets/display-only/markdown/widget";
import type definition from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

/**
 * Custom container widget for Kagi search results
 */
export function KagiSearchResultsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
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
          <Div className="flex gap-2">
            <NavigateButtonWidget field={children.backButton} />
            <SubmitButtonWidget<typeof definition.GET>
              field={{
                text: "get.submitButton.label",
                loadingText: "get.submitButton.loadingText",
                icon: "search",
                variant: "primary",
              }}
            />
          </Div>
        </Div>
      ) : (
        <TextFieldWidget fieldName="query" field={children.query} />
      )}

      {/* Results */}
      {hasResults && (
        <Div className="flex flex-col gap-4">
          {/* AI Answer Section */}
          {output && (
            <Card className="border-info/20 bg-info/5">
              <CardContent className="p-0">
                <Div className="flex items-center gap-2 px-4 py-3 border-b border-info/20 bg-info/10">
                  <Sparkles className="h-4 w-4 text-info" />
                  <Span className="text-sm font-semibold text-foreground">
                    {t("get.response.output.title")}
                  </Span>
                </Div>
                <Div className="p-4">
                  <MarkdownWidget
                    fieldName="output"
                    field={withValue(children.output, output ?? null, value)}
                  />
                </Div>
              </CardContent>
            </Card>
          )}

          {/* References Section */}
          {references.length > 0 && (
            <Div className="flex flex-col gap-2">
              <Div className="text-sm font-semibold text-muted-foreground px-1">
                {t("get.response.references.title")}
              </Div>
              <Div className="flex flex-col gap-2">
                {references.map((ref, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <CardContent className="p-0">
                      <ExternalLink
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 hover:bg-muted/50 transition-colors"
                      >
                        <Div className="flex items-start gap-3">
                          <Div className="rounded-lg bg-muted p-2 mt-0.5">
                            <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
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
                      </ExternalLink>
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
