"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { ConnectionTestResponseOutput } from "./definition";
import type endpoints from "./definition";

interface WidgetProps {
  field: {
    value: ConnectionTestResponseOutput | null | undefined;
  } & (typeof endpoints.POST)["fields"];
  fieldName: string;
}

export function ConnectionTestContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const value = field.value;

  return (
    <Div className="flex flex-col gap-2 min-h-[80px] px-4 py-3">
      <Span className="font-semibold text-sm">
        {t("app.api.ssh.connections.test.widget.title")}
      </Span>
      {value && (
        <Div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
          <Span className="text-muted-foreground">
            {t("app.api.ssh.connections.test.widget.latencyLabel")}
          </Span>
          <Span className="font-mono">{value.latencyMs}ms</Span>
          {value.fingerprint && (
            <>
              <Span className="text-muted-foreground">
                {t("app.api.ssh.connections.test.widget.fingerprintLabel")}
              </Span>
              <Span className="font-mono text-xs break-all">
                {value.fingerprint}
              </Span>
            </>
          )}
        </Div>
      )}
    </Div>
  );
}
