/**
 * AI Stream Client Component
 * Client-side interface for AI streaming functionality
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { Separator } from "next-vibe-ui/ui/separator";
import type React from "react";
import { useState } from "react";

import { aiStreamRequestSchema } from "@/app/api/[locale]/v1/core/agent/chat/ai-stream/definition";
import {
  useAiStreamChat,
  useAiStreamForm,
} from "@/app/api/[locale]/v1/core/agent/chat/ai-stream/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface AiStreamClientProps {
  locale: CountryLanguage;
}

export function AiStreamClient({
  locale,
}: AiStreamClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Configuration form endpoint
  const configEndpoint = useAiStreamForm({
    defaultValues: {
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 1000,
    },
  });

  // Chat functionality with streaming
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isStreaming,
    clearStreamingChat,
  } = useAiStreamChat({
    model: configEndpoint.create.form.watch("model"),
    temperature: configEndpoint.create.form.watch("temperature"),
    maxTokens: configEndpoint.create.form.watch("maxTokens"),
    systemPrompt: configEndpoint.create.form.watch("systemPrompt"),
    onFinish: () => {
      // Chat finished - handled by the hook
    },
    onError: () => {
      // Chat error - handled by the hook
    },
  });

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("streamingApi.aiStream.config.title")}</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
            >
              {isConfigOpen
                ? t("streamingApi.aiStream.config.hide")
                : t("streamingApi.aiStream.config.show")}
            </Button>
          </div>
        </CardHeader>
        {isConfigOpen && (
          <CardContent>
            <Form
              form={configEndpoint.create.form}
              onSubmit={() => {}}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="model"
                  config={{
                    type: "select",
                    label: "streamingApi.aiStream.fields.model",
                    options: [
                      {
                        value: "gpt-4o",
                        label: "streamingApi.aiStream.models.gpt4o",
                      },
                      {
                        value: "gpt-4o-mini",
                        label: "streamingApi.aiStream.models.gpt4oMini",
                      },
                      {
                        value: "gpt-4-turbo",
                        label: "streamingApi.aiStream.models.gpt4Turbo",
                      },
                    ],
                  }}
                  control={configEndpoint.create.form.control}
                  schema={aiStreamRequestSchema}
                />

                <EndpointFormField
                  name="temperature"
                  config={{
                    type: "number",
                    label: "streamingApi.aiStream.fields.temperature",
                    min: 0,
                    max: 2,
                    step: 0.1,
                  }}
                  control={configEndpoint.create.form.control}
                  schema={aiStreamRequestSchema}
                />

                <EndpointFormField
                  name="maxTokens"
                  config={{
                    type: "number",
                    label: "streamingApi.aiStream.fields.maxTokens",
                    min: 1,
                    max: 4000,
                  }}
                  control={configEndpoint.create.form.control}
                  schema={aiStreamRequestSchema}
                />

                <div className="md:col-span-2">
                  <EndpointFormField
                    name="systemPrompt"
                    config={{
                      type: "textarea",
                      label: "streamingApi.aiStream.fields.systemPrompt",
                      placeholder:
                        "streamingApi.aiStream.fields.systemPromptPlaceholder",
                    }}
                    control={configEndpoint.create.form.control}
                    schema={aiStreamRequestSchema}
                  />
                </div>
              </div>
            </Form>
          </CardContent>
        )}
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("streamingApi.aiStream.chat.title")}</CardTitle>
            <Button
              variant="outline"
              onClick={clearStreamingChat}
              disabled={isStreaming}
            >
              {t("streamingApi.aiStream.chat.clear")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages Display */}
            <div className="min-h-[400px] max-h-[600px] overflow-y-auto border rounded-lg p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {t("streamingApi.aiStream.chat.empty")}
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {message.role === "user"
                          ? t("streamingApi.aiStream.chat.user")
                          : t("streamingApi.aiStream.chat.assistant")}
                      </div>
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-sm font-medium mb-1">
                      {t("streamingApi.aiStream.chat.assistant")}
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                placeholder={t("streamingApi.aiStream.chat.placeholder")}
                onChange={handleInputChange}
                disabled={isStreaming}
              />
              <Button type="submit" disabled={isStreaming || !input.trim()}>
                {isStreaming
                  ? t("streamingApi.aiStream.chat.sending")
                  : t("streamingApi.aiStream.chat.send")}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
