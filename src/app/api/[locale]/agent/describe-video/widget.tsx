"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type definition from "./definition";
import type { DescribeVideoPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: DescribeVideoPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function DescribeVideoContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const result = field.value;

  return (
    <Div className="flex flex-col gap-3 p-4">
      {result?.text && (
        <Div className="flex flex-col gap-2">
          <Span className="text-sm text-foreground leading-relaxed">
            {result.text}
          </Span>
          <Div className="flex items-center gap-2 flex-wrap">
            {result.model && (
              <Badge variant="secondary" className="text-[10px]">
                {result.model}
              </Badge>
            )}
            {result.creditCost !== undefined && (
              <Badge variant="outline" className="text-[10px]">
                {result.creditCost}{" "}
                {result.creditCost === 1 ? "credit" : "credits"}
              </Badge>
            )}
          </Div>
        </Div>
      )}
    </Div>
  );
}
