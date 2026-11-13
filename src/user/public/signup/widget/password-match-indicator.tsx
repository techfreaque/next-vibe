"use client";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";

import type definition from "../definition";

/**
 * Live "passwords do not match" hint under the confirm field.
 *
 * The mismatch is only checked server-side, so users submitted, got a 400 in
 * the form alert above the fold and resubmitted the same pair (one prod error
 * row had 10 occurrences). Showing it inline before submit fixes the loop.
 * Stays quiet while the confirm value is still a prefix of the password.
 */
export function PasswordMatchIndicator(): React.JSX.Element | null {
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm();
  const password: string = form.watch("password") || "";
  const confirmPassword: string = form.watch("confirmPassword") || "";

  const stillTyping =
    confirmPassword.length < password.length &&
    password.startsWith(confirmPassword);
  if (!confirmPassword || stillTyping || confirmPassword === password) {
    return null;
  }

  return (
    <Div className="-mt-3 flex items-center gap-2 text-sm text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <Span>{t("fields.confirmPassword.validation.mismatch")}</Span>
    </Div>
  );
}
