/**
 * Referral Code Form Component
 * Form for creating new referral codes
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { EndpointLogger } from "../../system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "../../user/auth/types";
import referralDefinitions from "../definition";
import { useReferralCreate } from "../hooks";

interface ReferralCodeFormProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

export function ReferralCodeForm({
  locale,
  user,
  logger,
}: ReferralCodeFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const endpoint = useReferralCreate(logger, user);

  const { form, submitForm, isSubmitting } = endpoint.create;

  return (
    <Form form={form} onSubmit={submitForm} className="flex flex-col gap-4">
      <FormAlert alert={endpoint.alert} />

      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EndpointFormField
          name="code"
          control={form.control}
          endpoint={referralDefinitions.POST}
          locale={locale}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        <EndpointFormField
          name="label"
          control={form.control}
          endpoint={referralDefinitions.POST}
          locale={locale}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />
      </Div>

      <Div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("app.user.referral.createCode.creating")
            : t("app.user.referral.createCode.create")}
        </Button>
      </Div>
    </Form>
  );
}
