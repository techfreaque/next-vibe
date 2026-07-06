/**
 * Remote Event Registry
 *
 * Routes with onRemoteEvent handlers self-register here when endpointsHandler()
 * runs. The remote-event-bridge then looks up handlers by path+method+eventName
 * when a peer emits a remoteEvent:true endpoint-event.
 *
 * Key format: `${endpointPath.join("/")}:${method}` (e.g. "remote-connection/sync:POST")
 *
 * Incoming envelopes are parsed against the event declaration's schemas before
 * being handed to handlers:
 *   responseData  ← responseFields  → responseSchema.pick(fields)
 *   requestData   ← requestFields   → requestSchema.pick(fields)
 *   urlPathParams ← urlPathParamsFields → requestUrlPathParamsSchema.pick(fields)
 *   payload       ← payloadType (zod schema on the event declaration)
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  OnRemoteEventMap,
  RemoteEventContext,
} from "next-vibe/core/route/handler";
import type { WidgetData } from "next-vibe/core/utils/json";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import type { AnyEndpointEventEnvelope } from "../structured-events";

/**
 * Normalises an already-validated envelope field to a typed WidgetData record for
 * the dispatch handler. The field schemas above are dynamically assembled (their
 * static output is opaque); this re-types the gated value as the serialisable
 * record it is at runtime.
 */
const recordSchema: z.ZodType<Record<string, WidgetData>> = z.record(
  z.string(),
  WidgetDataSchema,
);

/** Erased handler signature used at dispatch time — fields are always validated Records at runtime. */
type AnyRemoteEventHandler = (props: {
  readonly responseData: Record<string, WidgetData>;
  readonly requestData: Record<string, WidgetData>;
  readonly urlPathParams: Record<string, WidgetData>;
  readonly payload: WidgetData;
  readonly instanceId: string;
  readonly originInstanceId: string;
  readonly user: JwtPrivatePayloadType;
  readonly locale: CountryLanguage;
  readonly logger: EndpointLogger;
  readonly isServer: true;
}) => Promise<void> | void;

interface RegistryEntry {
  /**
   * Handlers keyed by event name, held as erased dispatch signatures. Concrete
   * onRemoteEvent maps are widened to AnyRemoteEventHandler at registration (the
   * one type-erasure boundary): the dispatcher only ever calls them with data
   * validated against the same event declaration, and each handler re-narrows
   * internally via its own typed declaration.
   */
  handlers: Record<string, AnyRemoteEventHandler>;
  endpoint: CreateApiEndpointAny;
}

const registry = new Map<string, RegistryEntry>();

function key(endpointPath: readonly string[], method: string): string {
  return `${endpointPath.join("/")}:${method}`;
}

export function registerRemoteEventHandlers<
  TEndpoint extends CreateApiEndpointAny,
>(
  endpointPath: readonly string[],
  method: string,
  handlers: OnRemoteEventMap<TEndpoint>,
  endpoint: CreateApiEndpointAny,
): void {
  registry.set(key(endpointPath, method), {
    handlers: handlers as Record<string, AnyRemoteEventHandler>,
    endpoint,
  });
}

/**
 * Build a parse schema for one envelope field from the event declaration.
 *
 * - Flat responseFields/requestFields/urlPathParamsFields: pick those keys from
 *   the corresponding endpoint schema (if it is a ZodObject; passthrough otherwise).
 * - Nested responseFields ({ key: subFields[] | true }): build z.object({ key: ... })
 *   where each sub-array is a pick of the array element schema.
 * - payloadType: the zod schema declared on the event directly.
 * - Undeclared fields: a permissive record — accept any object.
 *
 * Returns a dynamically-assembled ZodTypeAny; the parsed result is normalised to
 * a WidgetData record at the call site via parseFieldRecord().
 */
function buildFieldSchema(
  baseSchema: z.ZodTypeAny,
  fieldSpec:
    | readonly string[]
    | Record<string, readonly string[] | true>
    | undefined,
): z.ZodTypeAny {
  if (fieldSpec === undefined) {
    return z.record(z.string(), WidgetDataSchema).default({});
  }

  // Flat array: pick those keys from the base ZodObject
  if (Array.isArray(fieldSpec)) {
    if (!(baseSchema instanceof z.ZodObject)) {
      return z.record(z.string(), WidgetDataSchema).default({});
    }
    const maskObj: Record<string, true> = {};
    for (const k of fieldSpec as string[]) {
      maskObj[k] = true;
    }
    return baseSchema.pick(maskObj).partial();
  }

  // Nested object spec: { messages: ["id","content"], streamingState: true }
  if (!(baseSchema instanceof z.ZodObject)) {
    return z.record(z.string(), WidgetDataSchema).default({});
  }
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [topKey, subSpec] of Object.entries(
    fieldSpec as Record<string, readonly string[] | true>,
  )) {
    const topFieldSchema = (baseSchema.shape as Record<string, z.ZodTypeAny>)[
      topKey
    ];
    if (!topFieldSchema) {
      continue;
    }
    if (subSpec === true) {
      shape[topKey] = topFieldSchema.optional();
    } else if (Array.isArray(subSpec)) {
      // Array field: unwrap ZodArray / ZodOptional / ZodNullable to get element schema
      const elementSchema = unwrapArrayElement(topFieldSchema);
      if (elementSchema instanceof z.ZodObject) {
        const mask: Record<string, true> = {};
        for (const f of subSpec as string[]) {
          mask[f] = true;
        }
        shape[topKey] = z.array(elementSchema.pick(mask).partial()).optional();
      } else {
        shape[topKey] = topFieldSchema.optional();
      }
    }
  }
  return z.object(shape).partial();
}

/** Unwrap ZodArray/ZodOptional/ZodNullable layers to reach the element schema */
function unwrapArrayElement(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodArray) {
    return schema.element as z.ZodTypeAny;
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return unwrapArrayElement(schema.unwrap() as z.ZodTypeAny);
  }
  return schema;
}

export async function dispatchRemoteEvent(
  endpointPath: readonly string[],
  method: string,
  envelope: AnyEndpointEventEnvelope,
  ctx: RemoteEventContext,
): Promise<void> {
  let entry = registry.get(key(endpointPath, method));
  if (!entry) {
    // Routes self-register their onRemoteEvent handlers when the route module
    // loads (endpointsHandler runs at module scope) — but route modules load
    // LAZILY per process. A relayed event can arrive before anything imported
    // the target route in THIS process, which would silently drop the event.
    // Force-load the route through the GENERATED remote-event registry (the
    // canonical path→route mapping — no alias guessing), then retry.
    //
    // The load is retried with a short backoff: concurrent dynamic imports of
    // a large cyclic route graph can observe a PARTIAL module namespace while
    // another import of the same graph is mid-evaluation — a beat later the
    // fully-evaluated module is cached and the same import succeeds.
    const { getRemoteEventRoutes } =
      await import("@/generated/routes/remote-event-routes");
    const routes = await getRemoteEventRoutes();
    const wanted = endpointPath.join("/");
    const match = routes.find(
      (r) => r.method === method && r.path.join("/") === wanted,
    );
    if (match) {
      for (let attempt = 0; attempt < 5 && !entry; attempt++) {
        if (attempt > 0) {
          await new Promise((resolve) => {
            setTimeout(resolve, 200 * attempt);
          });
        }
        try {
          await match.importRoute();
        } catch {
          // Partial-namespace TypeError — registration may still have run;
          // fall through to the registry check and retry otherwise.
        }
        entry = registry.get(key(endpointPath, method));
      }
    }
  }
  if (!entry) {
    ctx.logger.error(
      "[RemoteEventRegistry] No onRemoteEvent handlers for endpoint — dropping event",
      {
        endpointPath: endpointPath.join("/"),
        method,
        eventName: envelope.eventName,
      },
    );
    return;
  }
  const handler = entry.handlers[envelope.eventName];
  if (!handler) {
    return;
  }

  const { endpoint } = entry;
  const eventDecl = (
    endpoint.events as
      | Record<
          string,
          {
            responseFields?:
              | readonly string[]
              | Record<string, readonly string[] | true>;
            requestFields?: readonly string[];
            urlPathParamsFields?: readonly string[];
            payloadType?: z.ZodTypeAny;
          }
        >
      | undefined
  )?.[envelope.eventName];

  // Validate each envelope field against the event declaration's schemas (the
  // correctness gate: invalid/extra fields are stripped, missing optional fields
  // default to {}). On failure: log + drop. The gated value is then normalised to
  // a typed WidgetData record for the handler — the wire data is serialisable.
  const responseGate = buildFieldSchema(
    endpoint.responseSchema,
    eventDecl?.responseFields as
      | readonly string[]
      | Record<string, readonly string[] | true>
      | undefined,
  ).safeParse(envelope.responseData ?? {});
  const requestGate = buildFieldSchema(
    endpoint.requestSchema,
    eventDecl?.requestFields,
  ).safeParse(envelope.requestData ?? {});
  const urlGate = buildFieldSchema(
    endpoint.requestUrlPathParamsSchema,
    eventDecl?.urlPathParamsFields,
  ).safeParse(envelope.urlPathParams ?? {});

  if (!responseGate.success || !requestGate.success || !urlGate.success) {
    ctx.logger.warn(
      "[RemoteEventRegistry] Envelope parse failed — dropping event",
      {
        eventName: envelope.eventName,
        endpointPath: endpointPath.join("/"),
        responseError: responseGate.success
          ? undefined
          : responseGate.error.message,
        requestError: requestGate.success
          ? undefined
          : requestGate.error.message,
        urlError: urlGate.success ? undefined : urlGate.error.message,
      },
    );
    return;
  }

  let parsedPayload: WidgetData = undefined;
  if (eventDecl?.payloadType) {
    // The event's payloadType is the correctness gate; drop on validation failure.
    const gate = eventDecl.payloadType.safeParse(envelope.payload);
    if (!gate.success) {
      ctx.logger.warn(
        "[RemoteEventRegistry] Payload parse failed — dropping event",
        {
          eventName: envelope.eventName,
          endpointPath: endpointPath.join("/"),
          error: gate.error.message,
        },
      );
      return;
    }
    parsedPayload = WidgetDataSchema.parse(envelope.payload);
  }

  // Authorization is the connection's identity, not a per-resource channel check.
  // A relayed event is the connection's USER's own data syncing across their own
  // instances (a remote connection is one account, one userId per instance). It is
  // already authorized by: the connection's user resolved on this instance with
  // their REAL roles (see handleRemoteEvent), the echo-guard on originInstanceId,
  // and the sender's syncScope gate. The onRemoteEvent handler then applies it as
  // that user (scoping its own writes to the user's resources). No resolveChannel
  // gate here: resolveChannel is a SUBSCRIBE-time channel-admission check that does
  // a resource lookup — for a relayed `*-created`/`*-updated` event the resource
  // does not exist on this instance yet, so it would wrongly drop the very sync
  // meant to create it.
  await handler({
    responseData: recordSchema.parse(responseGate.data),
    requestData: recordSchema.parse(requestGate.data),
    urlPathParams: recordSchema.parse(urlGate.data),
    payload: parsedPayload,
    instanceId: ctx.instanceId,
    originInstanceId: ctx.originInstanceId,
    user: ctx.user,
    locale: ctx.locale,
    logger: ctx.logger,
    isServer: ctx.isServer,
  });
}
