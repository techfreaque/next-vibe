/**
 * Post-handler messaging fan-out: transactional email and SMS.
 *
 * Split out of `handler.ts` because it is OPTIONAL, and because it was the only
 * thing dragging app-level modules (`@/messenger/**`, `@/sms/**`) into `core/`.
 * A build that ships neither provider — CLI/MCP-only installs — has no route
 * declaring `email` or `sms`, and previously had to fork `handler.ts` to shed
 * the config fields and the two dispatch blocks. Now it substitutes an empty
 * `MessagingHandlerOptions` and a no-op runner, and `handler.ts` is unchanged.
 *
 * Behaviour is deliberately identical to the inline version: the same lazy
 * `await import(...)` at the same point in the request, guarded by the same
 * presence checks, awaited in the same order (email, then SMS). This is a move,
 * not a redesign — see the note on registration hooks at the bottom.
 */

import "server-only";

import type {
  EmailHandler,
  EmailHandleRequestOutput,
} from "@/messenger/providers/email/smtp-client/email-handling/handler";
import type { SmsFunctionType } from "@/sms/utils";

import type { EndpointLogger } from "../../logger/types";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import type { CountryLanguage } from "../i18n/core/config";
import type { TranslatedKeyType } from "../i18n/core/scoped-translation";
import type { TParams } from "../i18n/core/static-types";
import type { InferJwtPayloadTypeFromRoles } from "./handler-roles";

/**
 * SMS handler configuration
 */
export interface SMSHandler<TEndpoint extends CreateApiEndpointAny> {
  readonly ignoreErrors?: boolean;
  readonly render: SmsFunctionType<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"],
    TEndpoint["types"]["ScopedTranslationKey"]
  >;
}

/**
 * Messaging fields as declared on a per-method route config (`MethodHandlerConfig`),
 * where handlers are supplied as flat arrays.
 */
export interface MessagingMethodConfig<TEndpoint extends CreateApiEndpointAny> {
  email?: EmailHandler<TEndpoint>[];
  sms?: SMSHandler<TEndpoint>[];
}

/**
 * Messaging fields as they reach `createGenericHandler`, where `multi.ts` has
 * already wrapped the arrays in their `afterHandler*` envelopes.
 */
export interface MessagingHandlerOptions<
  TEndpoint extends CreateApiEndpointAny,
> {
  email?:
    | {
        afterHandlerEmails?: EmailHandler<TEndpoint>[];
      }
    | undefined;
  sms?: {
    afterHandlerSms?: SMSHandler<TEndpoint>[];
  };
}

/**
 * Wrap a method config's messaging arrays in the `afterHandler*` envelopes that
 * `createGenericHandler` expects.
 *
 * Extracted from `multi.ts`, where this wrapping was repeated verbatim once per
 * HTTP method. Keeping it here puts the envelope shape next to the two types
 * that define it, and lets a build with no messaging surface drop one call per
 * method instead of carrying five copies of the wrapping. Pure data reshaping
 * evaluated at the same point in the same call - nothing about when a handler
 * binds changes.
 */
export function messagingHandlerOptions<TEndpoint extends CreateApiEndpointAny>(
  config: MessagingMethodConfig<TEndpoint>,
): MessagingHandlerOptions<TEndpoint> {
  return {
    email: config.email ? { afterHandlerEmails: config.email } : undefined,
    sms: config.sms ? { afterHandlerSms: config.sms } : undefined,
  };
}

/** The validated request/response tuple the messaging templates render from. */
export interface AfterHandlerMessagingContext<
  TEndpoint extends CreateApiEndpointAny,
> {
  responseData: TEndpoint["types"]["ResponseOutput"];
  urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
  requestData: TEndpoint["types"]["RequestOutput"];
  t: (
    key: TEndpoint["types"]["ScopedTranslationKey"],
    params?: TParams,
  ) => TranslatedKeyType;
  locale: CountryLanguage;
  user: InferJwtPayloadTypeFromRoles<TEndpoint["allowedRoles"]>;
}

/**
 * Fan out to the messaging providers a route declared. No-ops when the route
 * declared none, which is the overwhelmingly common case.
 *
 * The provider modules stay behind `await import(...)` rather than a top-level
 * import so that installs without them never resolve the module graph — the
 * same reason the inline version did it. A registration hook (see
 * `realtime/core/relay-hook.ts`) would sever the dependency more cleanly still,
 * but it changes WHEN the provider is bound: with registration, a process that
 * never imports the messenger silently sends no mail. Eight live routes depend
 * on this path, so the lazy import is kept until that wiring is made explicit.
 */
export async function runAfterHandlerMessaging<
  TEndpoint extends CreateApiEndpointAny,
>(
  options: MessagingHandlerOptions<TEndpoint>,
  context: AfterHandlerMessagingContext<TEndpoint>,
  logger: EndpointLogger,
): Promise<void> {
  const { email, sms } = options;

  if (email?.afterHandlerEmails) {
    const { EmailHandlingRepository } =
      await import("@/messenger/providers/email/smtp-client/email-handling/repository");
    await EmailHandlingRepository.handleEmails<TEndpoint>(
      {
        email,
        responseData: context.responseData,
        urlPathParams: context.urlPathParams,
        requestData: context.requestData,
        t: context.t,
        locale: context.locale,
        user: context.user,
      } satisfies EmailHandleRequestOutput<TEndpoint>,
      logger,
    );
  }

  if (sms?.afterHandlerSms) {
    const { handleSms } = await import("@/sms/handle-sms");
    await handleSms<TEndpoint>({
      sms,
      user: context.user,
      responseData: context.responseData,
      urlPathParams: context.urlPathParams,
      requestData: context.requestData,
      t: context.t,
      locale: context.locale,
      logger,
    });
  }
}
