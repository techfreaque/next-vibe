/**
 * AI Tools Widget
 * Displays available AI tools with search, category filter, and two-tier status
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Shield,
  Wand2,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import { useState } from "react";

import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import {
  useWidgetDisabled,
  useWidgetTranslation,
} from "../../unified-ui/widgets/_shared/use-widget-context";
import type definition from "./definition";
import type { AIToolsListResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: AIToolsListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

export function AIToolsWidget({ field }: CustomWidgetProps): React.JSX.Element {
  const value = field.value;
  const children = field.children;
  const isDisabled = useWidgetDisabled();
  const t = useWidgetTranslation();

  const tools = value?.tools ?? [];
  const totalCount = value?.totalCount ?? 0;
  const matchedCount = value?.matchedCount ?? 0;
  const hasTools = tools.length > 0;
  const isFiltered = matchedCount < totalCount;

  // Group by category
  const toolsByCategory: Record<string, typeof tools> = {};
  for (const tool of tools) {
    const cat = tool.category || "Other";
    if (!toolsByCategory[cat]) {
      toolsByCategory[cat] = [];
    }
    toolsByCategory[cat].push(tool);
  }

  const categories = Object.keys(toolsByCategory).toSorted();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategory = (cat: string): void => {
    const next = new Set(expandedCategories);
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    setExpandedCategories(next);
  };

  return (
    <Div className="flex flex-col gap-4">
      {/* Search Form */}
      {!isDisabled ? (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
          <Div className="grid grid-cols-12 gap-3">
            <Div className="col-span-8">
              <TextFieldWidget fieldName="query" field={children.query} />
            </Div>
            <Div className="col-span-4">
              <TextFieldWidget fieldName="category" field={children.category} />
            </Div>
          </Div>
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget
            field={{
              text: "app.api.system.unifiedInterface.ai.tools.get.submitButton.label",
              loadingText:
                "app.api.system.unifiedInterface.ai.tools.get.submitButton.loadingText",
              icon: "search",
              variant: "primary",
            }}
          />
        </Div>
      ) : (
        <TextFieldWidget fieldName="query" field={children.query} />
      )}

      {/* Stats */}
      {value && (
        <Div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Div className="flex items-center gap-1.5">
            <Wand2 className="h-4 w-4" />
            <Span className="font-medium">
              {isFiltered
                ? t(
                    "app.api.system.unifiedInterface.ai.tools.get.widget.matchedOf",
                  )
                    .replace("{{matched}}", String(matchedCount))
                    .replace("{{total}}", String(totalCount))
                : t(
                    "app.api.system.unifiedInterface.ai.tools.get.widget.totalTools",
                  ).replace("{{count}}", String(totalCount))}
            </Span>
          </Div>
          {categories.length > 0 && (
            <Div className="flex items-center gap-1.5">
              <Span>
                {t(
                  "app.api.system.unifiedInterface.ai.tools.get.widget.categories",
                ).replace("{{count}}", String(categories.length))}
              </Span>
            </Div>
          )}
        </Div>
      )}

      {/* Tools by Category */}
      {hasTools && (
        <Div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const catTools = toolsByCategory[cat] ?? [];
            const isExpanded = expandedCategories.has(cat);

            return (
              <Card key={cat} className="overflow-hidden">
                <Div
                  onClick={() => toggleCategory(cat)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <Span className="text-sm font-medium flex-1">{cat}</Span>
                  <Badge variant="secondary" className="text-xs">
                    {catTools.length}
                  </Badge>
                </Div>

                {isExpanded && (
                  <CardContent className="p-0 border-t">
                    <Div className="divide-y">
                      {catTools.map((tool) => (
                        <ToolRow key={tool.toolName} tool={tool} />
                      ))}
                    </Div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </Div>
      )}

      {/* Category summary (overview mode: no tools but categories present) */}
      {!hasTools && value?.categories && value.categories.length > 0 && (
        <Div className="flex flex-col gap-2">
          {value.categories.map((cat) => (
            <Card key={cat.name} className="overflow-hidden">
              <Div className="flex items-center gap-3 px-4 py-3">
                <Span className="text-sm font-medium flex-1">{cat.name}</Span>
                <Badge variant="secondary" className="text-xs">
                  {cat.count}
                </Badge>
              </Div>
            </Card>
          ))}
        </Div>
      )}

      {/* Hint */}
      {value?.hint && (
        <Div className="text-center py-2 text-muted-foreground text-xs italic">
          {value.hint}
        </Div>
      )}

      {/* Empty state (no tools and no categories) */}
      {!hasTools && value && !value.categories?.length && !value.hint && (
        <Div className="text-center py-8 text-muted-foreground text-sm">
          {t(
            "app.api.system.unifiedInterface.ai.tools.get.widget.noToolsFound",
          )}
        </Div>
      )}
    </Div>
  );
}

function ToolRow({
  tool,
}: {
  tool: AIToolsListResponseOutput["tools"][0];
}): React.JSX.Element {
  return (
    <Div className="px-4 py-3 hover:bg-accent/30 transition-colors">
      <Div className="flex items-center gap-3">
        {/* Method badge */}
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 font-mono shrink-0"
        >
          {tool.method}
        </Badge>

        {/* Tool info */}
        <Div className="flex-1 min-w-0">
          <P className="text-sm font-medium truncate">{tool.description}</P>
          <Div className="flex items-center gap-2 mt-0.5">
            <Span className="text-[11px] text-muted-foreground/70 font-mono truncate">
              {tool.toolName}
            </Span>
            {tool.aliases && tool.aliases.length > 0 && (
              <Span className="text-[11px] text-muted-foreground/50">
                ({tool.aliases.join(", ")})
              </Span>
            )}
          </Div>
        </Div>

        {/* Status icons */}
        <Div className="flex items-center gap-2 shrink-0">
          {tool.requiresConfirmation && (
            <Div className="flex items-center gap-1 text-amber-500">
              <Shield className="h-3.5 w-3.5" />
            </Div>
          )}
          <Eye className="h-3.5 w-3.5 text-muted-foreground/40" />
        </Div>
      </Div>

      {/* Tags */}
      {tool.tags.length > 0 && (
        <Div className="flex gap-1 mt-1.5 ml-[52px]">
          {tool.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0"
            >
              {tag}
            </Badge>
          ))}
        </Div>
      )}
    </Div>
  );
}
