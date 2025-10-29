/**
 * IMAP Message Detail Component
 * Production-ready component for displaying and editing IMAP message details
 * Uses real API integration following leads/cron patterns
 */

"use client";

import {
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
  Mail,
  Paperclip,
  Star,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Separator } from "next-vibe-ui/ui/separator";
import type { JSX } from "react";
import React, { useState } from "react";

import { useImapMessageById } from "@/app/api/[locale]/v1/core/emails/imap-client/messages/[id]/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

interface ImapMessageDetailProps {
  messageId: string;
}

/**
 * IMAP Message Detail Component
 * Production-ready with real API integration and edit capabilities
 */
export function ImapMessageDetail({
  messageId,
}: ImapMessageDetailProps): JSX.Element {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Use real API endpoint following leads/cron patterns
  const messageEndpoint = useImapMessageById(
    {
      messageId,
      enabled: true,
    },
    logger,
  );

  const messageData = messageEndpoint.read?.data?.message;
  const isLoading = messageEndpoint.read?.isLoading;
  const readError = messageEndpoint.read?.error;

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">
            {t("app.admin.emails.imap.common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (readError || !messageData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {readError?.message ||
              t("app.admin.emails.imap.admin.messages.error.title", {
                error: "",
              })}
          </p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("app.admin.emails.imap.forms.back")}
          </Button>
        </div>
      </div>
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
      // Use the form's onSubmit method for PATCH operations
      const syntheticEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
      } as React.FormEvent<HTMLFormElement>;

      await messageEndpoint.create?.onSubmit(syntheticEvent);
      setIsEditMode(false);
      // Refetch data to get updated values
      await messageEndpoint.read?.refetch();
    } catch {
      // Error handling is done by the endpoint
      // No need to log as the endpoint handles error display
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
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
    <div className="space-y-6">
      {/* Header with Back Button and Edit Toggle */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("app.admin.emails.imap.forms.back")}
        </Button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {!messageData.isRead && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                {t("app.admin.emails.imap.messages.unread")}
              </Badge>
            )}
            {messageData.isFlagged && (
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            )}
          </div>
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
        </div>
      </div>

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
              className="space-y-4"
            >
              <FormAlert alert={messageEndpoint.alert} />

              <EndpointFormField
                control={messageEndpoint.create?.form.control}
                name="subject"
                config={{
                  type: "text",
                  label: "app.admin.emails.imap.messages.subject",
                  placeholder: "app.admin.emails.imap.messages.subject",
                }}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                control={messageEndpoint.create?.form.control}
                name="isRead"
                config={{
                  type: "checkbox",
                  label: "app.admin.emails.imap.messages.markAsRead",
                }}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                control={messageEndpoint.create?.form.control}
                name="isFlagged"
                config={{
                  type: "checkbox",
                  label: "app.admin.emails.imap.messages.flagged",
                }}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
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
                <span className="text-xl">{messageData.subject}</span>
                <div className="flex items-center space-x-2">
                  {messageData.hasAttachments && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Paperclip className="h-4 w-4" />
                      <span>{messageData.attachmentCount}</span>
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sender/Recipient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {t("app.admin.emails.imap.messages.from")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {messageData.senderName ? (
                        <>
                          {messageData.senderName} &lt;{messageData.senderEmail}
                          &gt;
                        </>
                      ) : (
                        messageData.senderEmail
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {t("app.admin.emails.imap.messages.to")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {messageData.recipientName ? (
                        <>
                          {messageData.recipientName} &lt;
                          {messageData.recipientEmail}&gt;
                        </>
                      ) : (
                        messageData.recipientEmail
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Info */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">
                    {t("app.admin.emails.imap.messages.sentAt")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {messageData.sentAt
                      ? formatDate(messageData.sentAt)
                      : t("app.admin.emails.imap.common.unknown")}
                  </div>
                </div>
              </div>

              {/* Message Size */}
              <div className="text-sm text-gray-600">
                {t("app.admin.emails.imap.messages.size")}:{" "}
                {messageData.messageSize
                  ? formatSize(messageData.messageSize)
                  : t("app.admin.emails.imap.common.unknown")}
              </div>
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
              <div className="prose max-w-none">
                {messageData.bodyHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: messageData.bodyHtml }}
                    className="whitespace-pre-wrap"
                  />
                ) : (
                  <div className="whitespace-pre-wrap">
                    {messageData.bodyText ||
                      t("app.admin.emails.imap.messages.noContent")}
                  </div>
                )}
              </div>
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
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">
                      {t("app.admin.emails.imap.messages.messageId")}:
                    </span>
                    <div className="text-gray-600 font-mono break-all">
                      {messageData.headers?.["Message-ID"] ||
                        messageData.imapMessageId ||
                        messageData.id}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("app.admin.emails.imap.messages.returnPath")}:
                    </span>
                    <div className="text-gray-600">
                      {messageData.headers?.["Return-Path"] ||
                        messageData.senderEmail}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="font-medium">
                    {t("app.admin.emails.imap.messages.createdAt")}:
                  </span>
                  <span className="text-gray-600 ml-2">
                    {messageData.createdAt
                      ? formatDate(messageData.createdAt)
                      : "-"}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">
                    {t("app.admin.emails.imap.messages.lastSync")}:
                  </span>
                  <span className="text-gray-600 ml-2">
                    {messageData.lastSyncAt
                      ? formatDate(messageData.lastSyncAt)
                      : t("app.admin.emails.imap.common.never")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
