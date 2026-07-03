"use client";

import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

interface CoaSetupWidgetProps {
  field: (typeof definition.POST)["fields"];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoaSetupWidget(_props: CoaSetupWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewAccounts = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../account/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />

      {data?.created !== undefined && (
        <Div className="rounded-md border p-4 bg-muted/30 flex flex-col gap-4">
          <Div className="flex gap-6 text-sm">
            <Div className="flex flex-col gap-1">
              <Span className="text-muted-foreground">
                {t("post.response.created")}
              </Span>
              <Span className="font-semibold text-2xl text-green-600">
                {data.created}
              </Span>
            </Div>
            <Div className="flex flex-col gap-1">
              <Span className="text-muted-foreground">
                {t("post.response.skipped")}
              </Span>
              <Span className="font-semibold text-2xl text-muted-foreground">
                {data.skipped}
              </Span>
            </Div>
          </Div>
          <Div>
            <Badge variant="default" className="mb-3">
              {t("post.success.title")}
            </Badge>
          </Div>
          <Button type="button" variant="outline" onClick={handleViewAccounts}>
            {t("post.widget.viewAccounts")}
          </Button>
        </Div>
      )}
    </Div>
  );
}
