"use client";

import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetResponseOnly,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEffect } from "react";

const attemptedForms = new WeakSet<ReturnType<typeof useWidgetForm>>();

export function submitInitialDesktopRead<TForm extends WeakKey>(
  attempts: WeakSet<TForm>,
  form: TForm,
  onSubmit: (() => void) | undefined,
  hasResponse: boolean,
  isLoading: boolean,
): void {
  if (attempts.has(form) || !onSubmit || hasResponse || isLoading) {
    return;
  }
  attempts.add(form);
  onSubmit();
}

export function useDesktopRead(): {
  onSubmit: (() => void) | undefined;
  isLoading: boolean;
} {
  const submit = useWidgetOnSubmit();
  const form = useWidgetForm();
  const response = useWidgetResponse();
  const responseOnly = useWidgetResponseOnly();
  const isLoading = useWidgetIsSubmitting() ?? false;
  const onSubmit = responseOnly ? undefined : submit;
  const hasResponse = Boolean(response);

  // The POST form outlives a lazy widget remount. Claim its initial read before
  // validation or a network reply can replace the submit callback.
  useEffect(() => {
    submitInitialDesktopRead(
      attemptedForms,
      form,
      onSubmit,
      hasResponse,
      isLoading,
    );
  }, [form, onSubmit, hasResponse, isLoading]);

  return { onSubmit, isLoading };
}
