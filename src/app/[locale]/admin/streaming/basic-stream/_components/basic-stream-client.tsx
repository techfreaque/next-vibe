/**
 * Basic Stream Client Component
 * Client-side interface for basic streaming functionality
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { Progress } from "next-vibe-ui/ui/progress";
import type React from "react";
import { useCallback, useState } from "react";

import { basicStreamRequestSchema } from "@/app/api/[locale]/v1/core/agent/chat/basic-stream/definition";
import {
  type StreamingMessage,
  useBasicStream,
  useBasicStreamForm,
} from "@/app/api/[locale]/v1/core/agent/chat/basic-stream/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface BasicStreamClientProps {
  locale: CountryLanguage;
}

export function BasicStreamClient({
  locale,
}: BasicStreamClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const [streamLog, setStreamLog] = useState<string[]>([]);

  // Configuration form endpoint
  const configEndpoint = useBasicStreamForm({
    defaultValues: {
      count: 10,
      delay: 1000,
      prefix: t("streamingApi.basicStream.defaultPrefix"),
      includeTimestamp: true,
      includeCounter: true,
    },
  });

  // Streaming functionality
  const {
    messages,
    isStreaming,
    streamingSummary,
    startStream,
    stopStream,
    clearMessages,
  } = useBasicStream({
    onMessage: useCallback(
      (message: StreamingMessage) => {
        setStreamLog((prev) => [
          ...prev,
          t("streamingApi.basicStream.log.messageReceived", {
            time: new Date().toLocaleTimeString(),
            content: message.content || "",
          }),
        ]);
      },
      [t],
    ),
    onComplete: useCallback(
      (summary: StreamingMessage) => {
        setStreamLog((prev) => [
          ...prev,
          t("streamingApi.basicStream.log.streamCompleted", {
            time: new Date().toLocaleTimeString(),
            totalMessages: summary.totalMessages || 0,
            duration: summary.duration || 0,
          }),
        ]);
      },
      [t],
    ),
    onError: useCallback(
      (error: StreamingMessage) => {
        setStreamLog((prev) => [
          ...prev,
          t("streamingApi.basicStream.log.error", {
            time: new Date().toLocaleTimeString(),
            error: error.error || "",
            message: error.message || "",
          }),
        ]);
      },
      [t],
    ),
  });

  const handleStartStream = (): void => {
    const formData = configEndpoint.create.form.getValues();
    setStreamLog([]);
    void startStream(formData);
  };

  const handleClearAll = (): void => {
    clearMessages();
    setStreamLog([]);
  };

  const progress = streamingSummary?.totalMessages
    ? (messages.length / streamingSummary.totalMessages) * 100
    : messages.length > 0 && configEndpoint.create.form.watch("count")
      ? (messages.length / (configEndpoint.create.form.watch("count") || 1)) *
        100
      : 0;

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("streamingApi.basicStream.config.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={configEndpoint.create.form}
            onSubmit={() => {}}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <EndpointFormField
                name="count"
                config={{
                  type: "number",
                  label: "streamingApi.basicStream.fields.count",
                  min: 1,
                  max: 100,
                }}
                control={configEndpoint.create.form.control}
                schema={basicStreamRequestSchema}
              />

              <EndpointFormField
                name="delay"
                config={{
                  type: "number",
                  label: "streamingApi.basicStream.fields.delay",
                  min: 100,
                  max: 5000,
                }}
                control={configEndpoint.create.form.control}
                schema={basicStreamRequestSchema}
              />

              <EndpointFormField
                name="prefix"
                config={{
                  type: "text",
                  label: "streamingApi.basicStream.fields.prefix",
                }}
                control={configEndpoint.create.form.control}
                schema={basicStreamRequestSchema}
              />

              <EndpointFormField
                name="includeTimestamp"
                config={{
                  type: "checkbox",
                  label: "streamingApi.basicStream.fields.includeTimestamp",
                }}
                control={configEndpoint.create.form.control}
                schema={basicStreamRequestSchema}
              />

              <EndpointFormField
                name="includeCounter"
                config={{
                  type: "checkbox",
                  label: "streamingApi.basicStream.fields.includeCounter",
                }}
                control={configEndpoint.create.form.control}
                schema={basicStreamRequestSchema}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Control Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("streamingApi.basicStream.controls.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              onClick={handleStartStream}
              disabled={isStreaming}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isStreaming
                ? t("streamingApi.basicStream.controls.streaming")
                : t("streamingApi.basicStream.controls.start")}
            </Button>
            <Button
              onClick={stopStream}
              disabled={!isStreaming}
              variant="destructive"
            >
              {t("streamingApi.basicStream.controls.stop")}
            </Button>
            <Button onClick={handleClearAll} variant="outline">
              {t("streamingApi.basicStream.controls.clear")}
            </Button>
          </div>

          {/* Progress Bar */}
          {(isStreaming || messages.length > 0) && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("streamingApi.basicStream.progress.label")}</span>
                <span>
                  {messages.length} /{" "}
                  {configEndpoint.create.form.watch("count")}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("streamingApi.basicStream.messages.titleWithCount", {
              count: messages.length,
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] max-h-[400px] overflow-y-auto border rounded-lg p-4 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                {t("streamingApi.basicStream.messages.empty")}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.index}-${index}`}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-500"
                >
                  <div className="font-mono text-sm">{message.content}</div>
                  {message.timestamp && (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {streamingSummary && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">
                {t("streamingApi.basicStream.summary.title")}
              </h4>
              <div className="text-sm text-green-700 dark:text-green-300 mt-2">
                <p>
                  {t("streamingApi.basicStream.summary.totalMessages")}:{" "}
                  {streamingSummary.totalMessages}
                </p>
                <p>
                  {t("streamingApi.basicStream.summary.duration")}:{" "}
                  {streamingSummary.duration}ms
                </p>
                <p>
                  {t("streamingApi.basicStream.summary.status")}:{" "}
                  {streamingSummary.completed
                    ? t("streamingApi.basicStream.summary.completed")
                    : t("streamingApi.basicStream.summary.incomplete")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Log */}
      <Card>
        <CardHeader>
          <CardTitle>{t("streamingApi.basicStream.log.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[200px] max-h-[300px] overflow-y-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            {streamLog.length === 0 ? (
              <div className="text-gray-500">
                {t("streamingApi.basicStream.log.empty")}
              </div>
            ) : (
              streamLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
