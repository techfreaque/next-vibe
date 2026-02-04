/**
 * IMAP Accounts Management Component
 * Component for managing IMAP accounts with list and forms
 * Follows leads/cron patterns - no useState, all state through useEndpoint
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Plus } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import { useState } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";

import { ImapAccountCreateForm } from "./imap-account-create-form";
import { ImapAccountsList } from "./imap-accounts-list";

interface ImapAccountsManagementProps {
  user: JwtPayloadType;
}

/**
 * IMAP Accounts Management Component
 * Uses useEndpoint for all state management following leads/cron patterns
 */
export function ImapAccountsManagement({
  user,
}: ImapAccountsManagementProps): JSX.Element {
  const { t, locale } = useTranslation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateSuccess = (): void => {
    setShowCreateDialog(false);
    // The list will automatically refresh due to useEndpoint
  };

  const handleCreateCancel = (): void => {
    setShowCreateDialog(false);
  };

  return (
    <Div className="flex flex-col gap-6">
      {/* Header with Create Button */}
      <Card>
        <CardHeader>
          <Div className="flex items-center justify-between">
            <CardTitle>
              {t("app.admin.emails.imap.admin.accounts.management.title")}
            </CardTitle>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("app.admin.emails.imap.account.create")}
            </Button>
          </Div>
        </CardHeader>
        <CardContent>
          {/* Accounts List - all state managed through useEndpoint */}
          <ImapAccountsList locale={locale} user={user} />
        </CardContent>
      </Card>

      {/* Create Account Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("app.admin.emails.imap.account.create")}
            </DialogTitle>
          </DialogHeader>
          <ImapAccountCreateForm
            locale={locale}
            user={user}
            onSuccess={handleCreateSuccess}
            onCancel={handleCreateCancel}
          />
        </DialogContent>
      </Dialog>
    </Div>
  );
}
