/**
 * Custom hook for test email endpoint
 * Handles test email sending with proper error handling
 */

import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

interface TestEmailRequest {
  templateId: string;
  recipientEmail: string;
  language: string;
  country: string;
  props: Record<string, string | number | boolean>;
}

interface TestEmailResponse {
  success: boolean;
  messageId?: string;
  recipientEmail?: string;
  subject?: string;
  sentAt?: string;
}

interface UseTestEmailEndpointReturn {
  execute: (data: TestEmailRequest) => Promise<TestEmailResponse | null>;
  isLoading: boolean;
  error: string | null;
  data: TestEmailResponse | null;
}

export function useTestEmailEndpoint(
  locale: CountryLanguage,
): UseTestEmailEndpointReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TestEmailResponse | null>(null);

  const execute = async (
    requestData: TestEmailRequest,
  ): Promise<TestEmailResponse | null> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const response = await fetch(`/api/${locale}/emails/preview/send-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorMessage = `Failed to send test email: ${response.statusText}`;
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }

    const responseData = await response.json();

    if (!responseData.success) {
      const errorMessage = responseData.message || "Failed to send test email";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }

    setData(responseData.data);
    setIsLoading(false);
    return responseData.data;
  };

  return {
    execute,
    isLoading,
    error,
    data,
  };
}
