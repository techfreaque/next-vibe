/**
 * IMAP Message Detail Component
 * Production-ready component for displaying and editing IMAP message details
 * Uses real API integration following leads/cron patterns
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
  Mail,
  Paperclip,
  Star,
  User,
} from "next-vibe-ui/ui/icons";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useState } from "react";

import messageDefinitions from "@/app/api/[locale]/emails/imap-client/messages/[id]/definition";
import { useImapMessageById } from "@/app/api/[locale]/emails/imap-client/messages/[id]/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../../../user/auth/types";

interface ImapMessageDetailProps {
  messageId: string;
  locale: CountryLanguage;
  user: JwtPayloadType;
}

/**
 * Format date string to localized string
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

/**
 * IMAP Message Detail Component
 * Production-ready with real API integration and edit capabilities
 */
export function ImapMessageDetail({
  messageId,
  locale,
  user,
}: ImapMessageDetailProps): JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Use real API endpoint following leads/cron patterns
  const messageEndpoint = useImapMessageById(
    {
      messageId,
      enabled: true,
    },
    user,
    logger,
  );

  const messageData = messageEndpoint.read?.data?.message;
  const isLoading = messageEndpoint.read?.isLoading;
  const readError = messageEndpoint.read?.error;

  // Handle loading and error states
  if (isLoading) {
    return (
      <Div className="flex items-center justify-center p-8">
        <Div className="text-center">
          <Div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <P className="text-gray-600">
            {t("app.admin.emails.imap.common.loading")}
          </P>
        </Div>
      </Div>
    );
  }

  if (readError || !messageData) {
    return (
      <Div className="p-8">
        <Div className="text-center">
          <P className="text-red-600 mb-4">
            {readError?.message ||
              t("app.admin.emails.imap.admin.messages.error.title", {
                error: "",
              })}
          </P>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("app.admin.emails.imap.forms.back")}
          </Button>
        </Div>
      </Div>
    );
  }

  const handleBack = (): void => {
    router.back();
  };

  const handleToggleEditMode = (): void => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async (): Promise<void> => {
    try {
      // Use the form's handleSubmit for PATCH operations
      await messageEndpoint.create.onSubmit();
      setIsEditMode(false);
      // Refetch data to get updated values
      await messageEndpoint.read.refetch();
    } catch {
      // Error handling is done by the endpoint
      // No need to log as the endpoint handles error display
    }
  };

  const formatSize = (bytes: number): string => {
    const sizes = [
      t("app.admin.emails.imap.common.bytes"),
      t("app.admin.emails.imap.common.kilobytes"),
      t("app.admin.emails.imap.common.megabytes"),
      t("app.admin.emails.imap.common.gigabytes"),
    ];
    if (bytes === 0) {
      return `0 ${t("app.admin.emails.imap.common.bytes")}`;
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <Div className="flex flex-col gap-6">
      {/* Header with Back Button and Edit Toggle */}
      <Div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("app.admin.emails.imap.forms.back")}
        </Button>
        <Div className="flex items-center flex-row gap-4">
          <Div className="items-center flex flex-row gap-2">
            {!messageData.isRead && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {t("app.admin.emails.imap.messages.unread")}
              </Badge>
            )}
            {messageData.isFlagged && (
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            )}
          </Div>
          <Button variant="outline" size="sm" onClick={handleToggleEditMode}>
            {isEditMode ? (
              <>
                <Eye className="h-4 w-4 mr-1" />
                {t("app.admin.emails.imap.common.view")}
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-1" />
                {t("app.admin.emails.imap.common.edit")}
              </>
            )}
          </Button>
          {isEditMode && (
            <Button
              onClick={handleSave}
              disabled={messageEndpoint.create?.isSubmitting}
            >
              {messageEndpoint.create?.isSubmitting
                ? t("app.admin.emails.imap.common.saving")
                : t("app.admin.emails.imap.common.save")}
            </Button>
          )}
        </Div>
      </Div>

      {/* Edit Form or View Mode */}
      {isEditMode ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {t("app.admin.emails.imap.messages.edit.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              form={messageEndpoint.create?.form}
              onSubmit={messageEndpoint.create?.onSubmit}
              className="flex flex-col gap-4"
            >
              <FormAlert alert={messageEndpoint.alert} />

              <EndpointFormField
                control={messageEndpoint.create?.form.control}
                endpoint={messageDefinitions.GET}
                name="subject"
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                control={messageEndpoint.create?.form.control}
                endpoint={messageDefinitions.GET}
                name="isRead"
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                control={messageEndpoint.create?.form.control}
                endpoint={messageDefinitions.GET}
                name="isFlagged"
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <Button
                type="submit"
                disabled={messageEndpoint.create?.isSubmitting}
              >
                {messageEndpoint.create?.isSubmitting
                  ? t("app.admin.emails.imap.common.saving")
                  : t("app.admin.emails.imap.common.save")}
              </Button>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Message Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Span className="text-xl">{messageData.subject}</Span>
                <Div className="flex items-center flex-row gap-2">
                  {messageData.hasAttachments && (
                    <Div className="flex items-center flex-row gap-1 text-sm text-gray-600">
                      <Paperclip className="h-4 w-4" />
                      <Span>{messageData.attachmentCount}</Span>
                    </Div>
                  )}
                </Div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Sender/Recipient Info */}
              <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Div className="flex items-center flex-row gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <Div>
                    <Div className="font-medium">
                      {t("app.admin.emails.imap.messages.from")}
                    </Div>
                    <Div className="text-sm text-gray-600">
                      {messageData.senderName ? (
                        <>
                          {messageData.senderName} &lt;{messageData.senderEmail}
                          &gt;
                        </>
                      ) : (
                        messageData.senderEmail
                      )}
                    </Div>
                  </Div>
                </Div>
                <Div className="flex items-center flex-row gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <Div>
                    <Div className="font-medium">
                      {t("app.admin.emails.imap.messages.to")}
                    </Div>
                    <Div className="text-sm text-gray-600">
                      {messageData.recipientName ? (
                        <>
                          {messageData.recipientName} &lt;
                          {messageData.recipientEmail}&gt;
                        </>
                      ) : (
                        messageData.recipientEmail
                      )}
                    </Div>
                  </Div>
                </Div>
              </Div>

              {/* Date Info */}
              <Div className="flex items-center flex-row gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <Div>
                  <Div className="font-medium">
                    {t("app.admin.emails.imap.messages.sentAt")}
                  </Div>
                  <Div className="text-sm text-gray-600">
                    {messageData.sentAt
                      ? formatDate(messageData.sentAt)
                      : t("app.admin.emails.imap.common.unknown")}
                  </Div>
                </Div>
              </Div>

              {/* Message Size */}
              <Div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.messages.size")}:{" "}
                {messageData.messageSize
                  ? formatSize(messageData.messageSize)
                  : t("app.admin.emails.imap.common.unknown")}
              </Div>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("app.admin.emails.imap.messages.content")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Div className="prose max-w-none">
                {messageData.bodyHtml ? (
                  <Div
                    dangerouslySetInnerHTML={{ __html: messageData.bodyHtml }}
                    className="whitespace-pre-wrap"
                  />
                ) : (
                  <Div className="whitespace-pre-wrap">
                    {messageData.bodyText ||
                      t("app.admin.emails.imap.messages.noContent")}
                  </Div>
                )}
              </Div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("app.admin.emails.imap.messages.technicalDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Div className="flex flex-col gap-2">
                <Div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <Div>
                    <Span className="font-medium">
                      {t("app.admin.emails.imap.messages.messageId")}:
                    </Span>
                    <Div className="text-gray-600 font-mono break-all">
                      {messageData.headers?.["Message-ID"] ||
                        messageData.imapMessageId ||
                        messageData.id}
                    </Div>
                  </Div>
                  <Div>
                    <Span className="font-medium">
                      {t("app.admin.emails.imap.messages.returnPath")}:
                    </Span>
                    <Div className="text-gray-600">
                      {messageData.headers?.["Return-Path"] ||
                        messageData.senderEmail}
                    </Div>
                  </Div>
                </Div>
                <Separator />
                <Div className="text-sm">
                  <Span className="font-medium">
                    {t("app.admin.emails.imap.messages.createdAt")}:
                  </Span>
                  <Span className="text-gray-600 ml-2">
                    {messageData.createdAt
                      ? formatDate(messageData.createdAt)
                      : "-"}
                  </Span>
                </Div>
                <Div className="text-sm">
                  <Span className="font-medium">
                    {t("app.admin.emails.imap.messages.lastSync")}:
                  </Span>
                  <Span className="text-gray-600 ml-2">
                    {messageData.lastSyncAt
                      ? formatDate(messageData.lastSyncAt)
                      : t("app.admin.emails.imap.common.never")}
                  </Span>
                </Div>
              </Div>
            </CardContent>
          </Card>
        </>
      )}
    </Div>
  );
}
