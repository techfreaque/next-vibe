/**
 * IMAP Account Form Component
 * Handles both creation and editing of IMAP accounts
 */

"use client";

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { ImapAccountCreateForm } from "./imap-account-create-form";
import { ImapAccountEditForm } from "./imap-account-edit-form";

interface ImapAccountFormProps {
  locale: CountryLanguage;
  accountId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * IMAP Account Form Component
 * Routes to appropriate create or edit form based on accountId
 */
export function ImapAccountForm({
  locale,
  accountId,
  onSuccess,
  onCancel,
}: ImapAccountFormProps): JSX.Element {
  if (accountId) {
    return (
      <ImapAccountEditForm
        locale={locale}
        accountId={accountId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    );
  }

  return (
    <ImapAccountCreateForm
      locale={locale}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
}
