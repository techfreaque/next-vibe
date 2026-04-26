/**
 * Custom Widget for Signup Form
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "next-vibe-ui/ui/form/form";
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Gift } from "next-vibe-ui/ui/icons/Gift";
import { Heart } from "next-vibe-ui/ui/icons/Heart";
import { Label } from "next-vibe-ui/ui/label";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { useEffect, useMemo, useState } from "react";

import { ChatFavoritesRepositoryClient } from "@/app/api/[locale]/agent/chat/favorites/repository-client";
import leadCurrentReferralDefinition, {
  type LeadCurrentReferralGetResponseOutput,
} from "@/app/api/[locale]/referral/lead/current/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { PasswordStrengthIndicator } from "./password-strength-indicator";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/widget";
import { LinkWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/widget";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/widget";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "../definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

/**
 * Custom container widget for signup form
 * Renders all fields with password strength indicator inline
 * Fetches current lead referral code and prefills the referral field if found
 */
export function SignupFormContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm();
  const t = useWidgetTranslation<typeof definition.POST>();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.POST>();

  const referralEndpoint = useEndpoint(
    leadCurrentReferralDefinition,
    useMemo(
      () => ({
        read: {
          queryOptions: {
            enabled: true,
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            onSuccess: ({
              responseData,
            }: {
              responseData: {
                referralCode: string | null;
                referralLabel: string | null;
              };
            }) => {
              if (responseData.referralCode) {
                form.setValue("referralCode", responseData.referralCode);
              }
            },
          },
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
    logger,
    user,
  );

  const referralData: LeadCurrentReferralGetResponseOutput | null =
    referralEndpoint.read?.response?.success
      ? (referralEndpoint.read.response
          .data as LeadCurrentReferralGetResponseOutput)
      : null;

  const prefillCode = referralData?.referralCode ?? null;
  const prefillLabel = referralData?.referralLabel ?? null;
  const displayLabel = prefillLabel ?? prefillCode;

  // UUID skills from localStorage for creator-support selector
  const [uuidSkills, setUuidSkills] = useState(() =>
    ChatFavoritesRepositoryClient.getLocalUuidSkillsForAttribution(),
  );
  const hasUuidSkills = uuidSkills.length > 0;

  // Async-resolve names for UUID skills that don't have one yet
  useEffect(() => {
    const missing = uuidSkills.filter((s) => !s.name);
    if (missing.length === 0) {
      return;
    }
    void (async () => {
      const resolved = await Promise.allSettled(
        missing.map(async (s) => {
          const res = await fetch(
            `/api/${locale}/agent/chat/skills/${s.skillId}`,
          );
          if (!res.ok) {
            return s;
          }
          const json = (await res.json()) as {
            data?: { name?: string | null };
          };
          return { skillId: s.skillId, name: json.data?.name ?? null };
        }),
      );
      const updates = new Map<string, string | null>();
      for (const r of resolved) {
        if (r.status === "fulfilled") {
          updates.set(r.value.skillId, r.value.name);
        }
      }
      if (updates.size > 0) {
        setUuidSkills((prev) =>
          prev.map((s) =>
            updates.has(s.skillId)
              ? { ...s, name: updates.get(s.skillId) ?? null }
              : s,
          ),
        );
      }
    })();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.title")}</CardTitle>
        <CardDescription>{t("form.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Name Fields - Grid 2 columns */}
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFieldWidget
            fieldName="privateName"
            field={children.privateName}
          />
          <TextFieldWidget fieldName="publicName" field={children.publicName} />
        </Div>

        {/* Email Field */}
        <EmailFieldWidget fieldName="email" field={children.email} />

        {/* Password Fields */}
        <PasswordFieldWidget fieldName="password" field={children.password} />

        {/* Password Strength Indicator - Inline after password field */}
        <PasswordStrengthIndicator />

        <PasswordFieldWidget
          fieldName="confirmPassword"
          field={children.confirmPassword}
        />

        {/* Checkboxes */}
        <BooleanFieldWidget
          fieldName="subscribeToNewsletter"
          field={children.subscribeToNewsletter}
        />
        {/* Accept Terms - matches BooleanFieldWidget layout with linked terms/conditions */}
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field: formField, fieldState }) => (
            <FormItem className="space-y-2">
              <Div className="flex flex-col gap-1">
                <Div className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      id={formField.name}
                      name={formField.name}
                      checked={formField.value as boolean}
                      onCheckedChange={(checked) => formField.onChange(checked)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </FormControl>
                  <Label
                    htmlFor={formField.name}
                    className="text-sm font-normal cursor-pointer leading-relaxed flex items-center gap-1.5"
                  >
                    <Span>{t("fields.acceptTerms.label")}</Span>
                    <Span className="text-xs text-muted-foreground opacity-75">
                      {t("fields.acceptTerms.descriptionPrefix")}{" "}
                      <Link
                        href={`/${locale}/story/terms-of-service`}
                        className="underline hover:text-foreground"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("fields.acceptTerms.termsLink")}
                      </Link>{" "}
                      {t("fields.acceptTerms.descriptionAnd")}{" "}
                      <Link
                        href={`/${locale}/story/privacy-policy`}
                        className="underline hover:text-foreground"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("fields.acceptTerms.conditionsLink")}
                      </Link>{" "}
                      {t("fields.acceptTerms.descriptionSuffix")}
                    </Span>
                  </Label>
                </Div>
              </Div>
              {fieldState.error && (
                <Div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <FormMessage t={t} />
                </Div>
              )}
            </FormItem>
          )}
        />

        {/* Referral Code - readonly display if prefilled, editable field otherwise */}
        {prefillCode ? (
          <Div className="flex flex-col gap-2">
            <Label>{t("fields.referralCode.labelPrefilled")}</Label>
            <Div className="flex items-center gap-3 rounded-md border border-border bg-muted px-3 py-2 h-9">
              <Gift className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">{displayLabel}</span>
            </Div>
            <p className="text-sm text-muted-foreground">
              {t("fields.referralCode.descriptionPrefilled")}
            </p>
          </Div>
        ) : (
          <TextFieldWidget
            fieldName="referralCode"
            field={children.referralCode}
          />
        )}

        {/* Creator support selector - only shown when user has UUID skills in localStorage */}
        {hasUuidSkills && (
          <FormField
            control={form.control}
            name="supportedSkillId"
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <Div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500 shrink-0" />
                  <Label className="text-sm font-medium">
                    {t("fields.supportedSkillId.selectorTitle")}
                  </Label>
                </Div>
                <p className="text-sm text-muted-foreground">
                  {t("fields.supportedSkillId.selectorDescription")}
                </p>
                <Div className="flex flex-col gap-2">
                  {uuidSkills.map(({ skillId, name }) => (
                    <Div
                      key={skillId}
                      className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition-colors ${
                        formField.value === skillId
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                      onClick={() => formField.onChange(skillId)}
                    >
                      <FormControl>
                        <input
                          type="radio"
                          className="accent-primary"
                          checked={formField.value === skillId}
                          onChange={() => formField.onChange(skillId)}
                        />
                      </FormControl>
                      <Span className="text-sm">
                        {name ?? skillId.slice(0, 8) + "…"}
                      </Span>
                    </Div>
                  ))}
                  <Div
                    className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition-colors ${
                      !formField.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                    onClick={() => formField.onChange(undefined)}
                  >
                    <FormControl>
                      <input
                        type="radio"
                        className="accent-primary"
                        checked={!formField.value}
                        onChange={() => formField.onChange(undefined)}
                      />
                    </FormControl>
                    <Span className="text-sm text-muted-foreground">
                      {t("fields.supportedSkillId.selectorNone")}
                    </Span>
                  </Div>
                </Div>
              </FormItem>
            )}
          />
        )}

        {/* Form Alert */}
        <FormAlertWidget field={children.formAlert} />

        {/* Response Message (if any) */}
        {data?.message && (
          <AlertWidget
            fieldName="message"
            field={withValue(children.message, data.message, null)}
          />
        )}

        {/* Submit Button */}
        <SubmitButtonWidget<typeof definition.POST>
          field={children.submitButton}
        />

        {/* Footer Link */}
        <LinkWidget
          field={children.alreadyHaveAccount}
          fieldName="alreadyHaveAccount"
        />
      </CardContent>
    </Card>
  );
}
