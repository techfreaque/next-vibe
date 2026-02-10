/**
 * Custom Widget for Brave Search Results
 */

"use client";

import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Clock, ExternalLink } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";

import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { useWidgetDisabled } from "../../../system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type definition from "./definition";
import type { BraveSearchGetResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: BraveSearchGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for Brave search results
 */
export function BraveSearchResultsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = field.value;
  const children = field.children;
  const isDisabled = useWidgetDisabled();

  const results = value?.results ?? [];
  const hasResults = results.length > 0;

  return (
    <Div className="flex flex-col gap-4">
      {/* Search Form */}
      {!isDisabled ? (
        <Div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
          <TextFieldWidget fieldName="query" field={children.query} />
          <Div className="grid grid-cols-3 gap-4">
            <NumberFieldWidget
              fieldName="maxResults"
              field={children.maxResults}
            />
            <BooleanFieldWidget
              fieldName="includeNews"
              field={children.includeNews}
            />
            <TextFieldWidget fieldName="freshness" field={children.freshness} />
          </Div>
          <FormAlertWidget field={{}} />

          <SubmitButtonWidget
            field={{
              text: "app.api.agent.search.brave.get.submitButton.label",
              loadingText:
                "app.api.agent.search.brave.get.submitButton.loadingText",
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
        <Div className="flex flex-col gap-2">
          <Div className="flex flex-col gap-2">
            {results.map((result, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-0">
                  <Link
                    href={result.url}
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
                  </Link>
                </CardContent>
              </Card>
            ))}
          </Div>
        </Div>
      )}
    </Div>
  );
}
