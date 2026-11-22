"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import type { JSX, ReactNode } from "react";
import { useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { useWidgetContext } from "../_shared/use-widget-context";
import { WidgetContextProvider } from "../_shared/WidgetContextProvider";

export function AnalyticsFilterPanel({
  fields,
  applyLabel,
  onApply,
  children,
}: {
  fields: readonly string[];
  applyLabel: string;
  onApply: () => void;
  children: ReactNode;
}): JSX.Element {
  const context = useWidgetContext();
  const { endpoint, form } = context;
  const appliedValues = useWatch({ control: form.control, name: fields });
  const values = Object.fromEntries(
    fields.map((name, index) => [name, appliedValues[index]]),
  );
  const schema = useMemo(
    () =>
      endpoint.formSchema.pick(
        Object.fromEntries(fields.map((name): [string, true] => [name, true])),
      ),
    [endpoint.formSchema, fields],
  );
  // Keep draft edits out of the endpoint form until the user applies them.
  const draft = useForm({ values, resolver: zodResolver(schema) });
  const apply = (): void => {
    void draft.handleSubmit((next) => {
      for (const name of fields) {
        form.setValue(name, next[name], { shouldDirty: true });
      }
      onApply();
    })();
  };

  return (
    <WidgetContextProvider
      context={{ ...context, form: draft, onSubmit: apply }}
      exposeFormForE2E={false}
    >
      <FormProvider {...draft}>
        <Div
          className="flex flex-col gap-3"
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.defaultPrevented &&
              typeof HTMLInputElement !== "undefined" &&
              event.target instanceof HTMLInputElement
            ) {
              event.preventDefault();
              apply();
            }
          }}
        >
          {children}
          <Div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={context.disabled}
              onClick={apply}
            >
              {applyLabel}
            </Button>
          </Div>
        </Div>
      </FormProvider>
    </WidgetContextProvider>
  );
}
