"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRef, useState } from "react";

import {
  NEWSLETTER_STATUS_QUERY_PREFIX,
  type NewsletterPromoState,
  OWN_NEWSLETTER_STATUS_QUERY_KEY,
  toNewsletterPromoState,
} from "../promo-state";
import type { StatusGetResponseOutput } from "../status/definition";
import type subscribeEndpoints from "../subscribe/definition";
import type {
  SubscribePostRequestOutput,
  SubscribePostResponseOutput,
} from "../subscribe/definition";
import { useLayoutNewsletterStatus } from "./newsletter-status-provider";

async function readStatus(
  locale: CountryLanguage,
  user: JwtPayloadType,
  logger: EndpointLogger,
  email?: string,
): Promise<ResponseType<StatusGetResponseOutput> | null> {
  const [{ default: endpoints }, { executeQuery }] = await Promise.all([
    import("../status/definition"),
    import("next-vibe/unified-ui/hooks/query-executor"),
  ]);
  const request = endpoints.GET.requestSchema.safeParse(
    email === undefined ? {} : { email },
  );
  if (!request.success) {
    return null;
  }
  return executeQuery({
    endpoint: endpoints.GET,
    requestData: request.data,
    pathParams: undefined,
    locale,
    user,
    logger,
  });
}

export function useInlineNewsletterPromo(
  locale: CountryLanguage,
  user: JwtPayloadType,
  initialStatus?: StatusGetResponseOutput,
): {
  state: NewsletterPromoState;
  email: string | undefined;
  refresh: () => Promise<void>;
} {
  const logger = useLogger();
  const layoutStatus = useLayoutNewsletterStatus();
  const seed = initialStatus ?? layoutStatus;
  const status = useQuery<ResponseType<StatusGetResponseOutput> | null>({
    queryKey: [OWN_NEWSLETTER_STATUS_QUERY_KEY],
    queryFn: () => readStatus(locale, user, logger),
    initialData: seed ? { success: true, data: seed } : undefined,
    // SSR supplies the first render. Observe the shared cache for changes, and
    // fetch on mount only when the server's lookup failed.
    enabled: !seed,
  });
  const response: ResponseType<StatusGetResponseOutput> | null | undefined =
    status.data;
  const data = response?.success ? response.data : seed;
  return {
    state:
      status.isError || response?.success === false
        ? "none"
        : toNewsletterPromoState(data),
    email: data?.subscriptionEmail,
    refresh: async () => {
      await status.refetch();
    },
  };
}

export function useInlineNewsletterAddressStatus(
  locale: CountryLanguage,
  user: JwtPayloadType,
  email: string,
  enabled: boolean,
): boolean {
  const logger = useLogger();
  const { data } = useQuery({
    queryKey: [`${NEWSLETTER_STATUS_QUERY_PREFIX}-${email}`],
    queryFn: () => readStatus(locale, user, logger, email),
    enabled: enabled && email.includes("@"),
  });
  return data?.success === true && data.data.subscribed;
}

interface InlineSubscription {
  submit: (email: string) => Promise<void>;
  isPending: boolean;
  result: "sent" | "error" | null;
}

export function useInlineNewsletterSubscription(
  locale: CountryLanguage,
  user: JwtPayloadType,
  refreshStatus: () => Promise<void>,
): InlineSubscription {
  const logger = useLogger();
  const submitting = useRef(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const mutation = useMutation({
    mutationFn: async ({
      endpoint,
      requestData,
    }: {
      endpoint: typeof subscribeEndpoints.POST;
      requestData: SubscribePostRequestOutput;
    }): Promise<ResponseType<SubscribePostResponseOutput>> => {
      const { executeMutation } =
        await import("next-vibe/unified-ui/hooks/mutation-executor");
      return executeMutation({
        endpoint,
        requestData,
        pathParams: undefined,
        locale,
        user,
        logger,
      });
    },
    onSuccess: async (response) => {
      if (response.success) {
        await refreshStatus();
      }
    },
  });

  const submit = async (email: string): Promise<void> => {
    if (submitting.current) {
      return;
    }
    submitting.current = true;
    try {
      const { default: endpoints } = await import("../subscribe/definition");
      const request = endpoints.POST.requestSchema.safeParse({ email });
      if (request.success) {
        setLoadFailed(false);
        await mutation.mutateAsync({
          endpoint: endpoints.POST,
          requestData: request.data,
        });
      }
    } catch (error) {
      logger.error(
        "Failed to submit inline newsletter subscription",
        parseError(error),
      );
      setLoadFailed(true);
    } finally {
      submitting.current = false;
    }
  };

  return {
    submit,
    isPending: mutation.isPending,
    result:
      loadFailed || mutation.data?.success === false
        ? "error"
        : mutation.data?.success
          ? "sent"
          : null,
  };
}
