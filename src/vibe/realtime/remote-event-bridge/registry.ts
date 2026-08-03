/**
 * Remote Event Dispatch
 *
 * Dispatches relayed remote events to the onRemoteEvent handlers declared on
 * the target endpoint. Routes are loaded on demand via the generated
 * remote-event-routes registry — no in-memory registration required.
 *
 * Incoming envelopes are parsed against the event declaration's schemas before
 * being handed to handlers:
 *   responseData  ← responseFields  → responseSchema.pick(fields)
 *   requestData   ← requestFields   → requestSchema.pick(fields)
 *   urlPathParams ← urlPathParamsFields → requestUrlPathParamsSchema.pick(fields)
 *   payload       ← payloadType (zod schema on the event declaration)
 */

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { RemoteEventContext } from "../../core/route/handler-realtime";
import type { WidgetData } from "../../core/utils/json";
import { WidgetDataSchema } from "../../core/utils/json";
import type { EndpointLogger } from "../../logger/types";
import { z } from "zod";

import type { AnyEndpointEventEnvelope } from "../core/structured-events";
import type { RegistryRouteModule } from "../server/ws-channel-registry";

const recordSchema: z.ZodType<Record<string, WidgetData>> = z.record(
  z.string(),
  WidgetDataSchema,
);

/**
 * Build a parse schema for one envelope field from the event declaration.
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

function unwrapArrayElement(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodArray) {
    return schema.element as z.ZodTypeAny;
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return unwrapArrayElement(schema.unwrap() as z.ZodTypeAny);
  }
  return schema;
}

function gateEnvelope(
  endpoint: CreateApiEndpointAny,
  envelope: AnyEndpointEventEnvelope,
  logger: EndpointLogger,
): {
  responseData: Record<string, WidgetData>;
  requestData: Record<string, WidgetData>;
  urlPathParams: Record<string, WidgetData>;
  payload: WidgetData;
} | null {
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
    logger.warn(
      "[RemoteEventRegistry] Envelope parse failed — dropping event",
      {
        eventName: envelope.eventName,
        endpointPath: endpoint.path.join("/"),
        responseError: responseGate.success
          ? undefined
          : responseGate.error.message,
        requestError: requestGate.success
          ? undefined
          : requestGate.error.message,
        urlError: urlGate.success ? undefined : urlGate.error.message,
      },
    );
    return null;
  }

  let parsedPayload: WidgetData = undefined;
  if (eventDecl?.payloadType) {
    const gate = eventDecl.payloadType.safeParse(envelope.payload);
    if (!gate.success) {
      logger.warn(
        "[RemoteEventRegistry] Payload parse failed — dropping event",
        {
          eventName: envelope.eventName,
          endpointPath: endpoint.path.join("/"),
          error: gate.error.message,
        },
      );
      return null;
    }
    parsedPayload = WidgetDataSchema.parse(envelope.payload);
  }

  return {
    responseData: recordSchema.parse(responseGate.data),
    requestData: recordSchema.parse(requestGate.data),
    urlPathParams: recordSchema.parse(urlGate.data),
    payload: parsedPayload,
  };
}

export async function dispatchRemoteEvent(
  endpointPath: readonly string[],
  method: string,
  envelope: AnyEndpointEventEnvelope,
  ctx: RemoteEventContext,
): Promise<void> {
  const { getRemoteEventRoutes } =
    await import("@/generated/routes/remote-event-routes");
  const routes = await getRemoteEventRoutes();
  const wanted = endpointPath.join("/");
  const match = routes.find(
    (r) => r.method === method && r.endpoint.path.join("/") === wanted,
  );

  if (!match) {
    ctx.logger.error(
      "[RemoteEventRegistry] No route registered for endpoint — dropping event",
      { endpointPath: wanted, method, eventName: envelope.eventName },
    );
    return;
  }

  // Load the route module. Retry with backoff to handle Bun's partial-namespace
  // race during concurrent dynamic imports of large cyclic route graphs.
  let routeModule: RegistryRouteModule | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, 200 * attempt);
      });
    }
    try {
      routeModule = await match.importRoute();
      break;
    } catch {
      // Partial-namespace TypeError — retry
    }
  }

  if (!routeModule) {
    ctx.logger.error(
      "[RemoteEventRegistry] Failed to load route module — dropping event",
      { endpointPath: wanted, method, eventName: envelope.eventName },
    );
    return;
  }

  const toolHandler = routeModule.tools[method];
  if (!toolHandler?.onRemoteEvent) {
    ctx.logger.error(
      "[RemoteEventRegistry] Route loaded but no onRemoteEvent handler — dropping event",
      { endpointPath: wanted, method, eventName: envelope.eventName },
    );
    return;
  }

  const handler = toolHandler.onRemoteEvent[envelope.eventName];
  if (!handler) {
    return;
  }

  const gated = gateEnvelope(match.endpoint, envelope, ctx.logger);
  if (!gated) {
    return;
  }

  await handler({
    ...gated,
    instanceId: ctx.instanceId,
    originInstanceId: ctx.originInstanceId,
    user: ctx.user,
    locale: ctx.locale,
    logger: ctx.logger,
    isServer: ctx.isServer,
  });
}
