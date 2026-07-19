"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function InventoryTransferReceiveWidget(): JSX.Element {
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  return (
    <Div className="max-w-lg mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            navigation.pop();
          }}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("transferReceive.post.widget.backToTransfer")}
        </Button>
      )}

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "transferReceive.post.title" as const }}
      />
    </Div>
  );
}
