/**
 * Custom Widget for Unified Web Search Results
 * Renders AI answer (if present) + search results list
 */

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { ExternalLink as ExternalLinkIcon } from "next-vibe-ui/ui/icons/ExternalLink";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { MarkdownWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

/**
 * Custom container widget for unified web search results
 */
export function WebSearchResultsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const isDisabled = useWidgetDisabled();

  const results = value?.results ?? [];
  const hasResults = results.length > 0;

  // Process output to replace Kagi reference markers 【1】 with markdown links
  const output = value?.output
    ? value.output.replace(/【(\d+)】/g, (match, num) => {
        const index = parseInt(num, 10) - 1;
        const ref = results[index];
        return ref ? `[${num}](${ref.url})` : match;
      })
    : undefined;

  return (
    <Div className="flex flex-col gap-4">
      {/* Search Form */}
      {!isDisabled ? (
        <Div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
          <TextFieldWidget fieldName="query" field={children.query} />
          <Div className="grid grid-cols-12 gap-4">
            <Div className="col-span-4">
              <TextFieldWidget fieldName="provider" field={children.provider} />
            </Div>
            <Div className="col-span-3">
              <NumberFieldWidget
                fieldName="maxResults"
                field={children.maxResults}
              />
            </Div>
            <Div className="col-span-2">
              <BooleanFieldWidget
                fieldName="includeNews"
                field={children.includeNews}
              />
            </Div>
            <Div className="col-span-3">
              <TextFieldWidget
                fieldName="freshness"
                field={children.freshness}
              />
            </Div>
          </Div>
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

      {/* AI Answer Section (Kagi only) */}
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

      {/* Results */}
      {hasResults && (
        <Div className="flex flex-col gap-2">
          {results.map((result, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-0">
                <ExternalLink
                  href={result.url}
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
                        {result.title}
                      </Div>
                      {result.snippet && (
                        <Div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {result.snippet}
                        </Div>
                      )}
                      <Div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Span className="truncate">
                          {new URL(result.url).hostname}
                        </Span>
                        {result.age && (
                          <>
                            <Span>•</Span>
                            <Div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <Span>{result.age}</Span>
                            </Div>
                          </>
                        )}
                        {result.source && (
                          <>
                            <Span>•</Span>
                            <Span>{result.source}</Span>
                          </>
                        )}
                      </Div>
                    </Div>
                  </Div>
                </ExternalLink>
              </CardContent>
            </Card>
          ))}
        </Div>
      )}
    </Div>
  );
}
