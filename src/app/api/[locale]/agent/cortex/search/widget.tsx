/**
 * Cortex Search Widget (Web)
 * Search results with file path, excerpt, and match count.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function CortexSearchWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const isDisabled = useWidgetDisabled();

  const results = value?.results ?? [];

  return (
    <Div className="flex flex-col gap-4">
      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
          <TextFieldWidget fieldName="query" field={children.query} />
          <Div className="grid grid-cols-12 gap-4">
            <Div className="col-span-8">
              <TextFieldWidget fieldName="path" field={children.path} />
            </Div>
            <Div className="col-span-4">
              <NumberFieldWidget
                fieldName="maxResults"
                field={children.maxResults}
              />
            </Div>
          </Div>
          <FormAlertWidget field={{}} />
          <Div className="flex gap-2">
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
      )}

      {/* Response */}
      {value && (
        <Div className="flex flex-col gap-3">
          {/* Header */}
          <Div className="flex items-center justify-between px-1">
            <Span className="text-sm text-muted-foreground">
              &quot;{value.responseQuery}&quot;
            </Span>
            <Badge variant="outline">
              {value.total} {t("get.response.total.text")}
            </Badge>
          </Div>

          {/* Results */}
          {results.length === 0 ? (
            <Div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-40" />
              <Span className="text-sm">{t("get.noResults")}</Span>
            </Div>
          ) : (
            <Div className="flex flex-col gap-2">
              {results.map((result, i) => (
                <Card
                  key={i}
                  className="overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-3">
                    <Div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <Div className="flex-1 min-w-0">
                        <Span className="font-mono text-sm font-medium block">
                          {result.resultPath}
                        </Span>
                        {result.excerpt && (
                          <Span className="text-xs text-muted-foreground line-clamp-2 mt-1 block">
                            {result.excerpt}
                          </Span>
                        )}
                      </Div>
                      <Span className="text-xs text-muted-foreground shrink-0">
                        {new Date(result.updatedAt).toLocaleDateString()}
                      </Span>
                    </Div>
                  </CardContent>
                </Card>
              ))}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
