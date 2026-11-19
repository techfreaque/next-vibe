"use client";

import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";

import type definitions from "./definition";

export default function SignupBounceSyncWidget({
  field,
}: {
  field: (typeof definitions.POST)["fields"];
}): React.JSX.Element {
  const result = useWidgetValue<typeof definitions.POST>();
  const t = useWidgetTranslation<typeof definitions.POST>();
  return (
    <>
      <FormAlertWidget field={field.children.alert} />
      {result && <P>{t("bounceSync.result", { count: result.marked })}</P>}
      <SubmitButtonWidget field={field.children.submit} />
    </>
  );
}
