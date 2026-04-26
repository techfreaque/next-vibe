/**
 * Cortex Search Widget (Web)
 * Search results with file path, excerpt, and match count.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { CortexNav } from "../_shared/cortex-nav";

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
  const navigation = useWidgetNavigation();

  const results = value?.results ?? [];

  async function openFile(filePath: string): Promise<void> {
    const readDef = await import("../read/definition");
    navigation.push(readDef.default.GET, { data: { path: filePath } });
  }

  return (
    <Div className="flex flex-col gap-4">
      {/* Top nav */}
      <CortexNav actions={["list", "tree", "write"]} />

      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card mx-4">
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
        <Div className="flex flex-col gap-3 px-4 pb-4">
          {/* Header */}
          <Div className="flex items-center justify-between">
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
                <Button
                  key={i}
                  variant="ghost"
                  onClick={() => void openFile(result.resultPath)}
                  className="w-full h-auto flex items-start gap-2 p-3 justify-start rounded-md border border-border hover:border-primary/50 transition-colors"
                >
                  <FileText className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <Div className="flex-1 min-w-0 text-left">
                    <Span className="font-mono text-sm font-medium block truncate">
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
                </Button>
              ))}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
