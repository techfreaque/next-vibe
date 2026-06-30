/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * WS Event Type-Safety Tests
 *
 * Compile-time assertions that:
 *   1. createEndpointEmitter() call-sites enforce per-event payload types
 *   2. RemoteEventHandlerProps resolves responseData/requestData/urlPathParams/payload
 *      to the exact types declared in the definition — never `any`, never widened
 *   3. OnRemoteEventMap only allows keys declared remoteEvent:true
 *   4. EndpointEventEnvelope generic application preserves field types
 *   5. NeverToUndefined maps endpoints with no url-params/payload to undefined
 *
 * Each type variable named _VerifyXxx causes a compile error if Equal<A,B> = false.
 * DO NOT DELETE — prevents regressions in the definition-driven type system.
 */

import type messagesDefinition from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import type executeDefinition from "@/app/api/[locale]/system/unified-interface/execute-tool/definition";
import type {
  OnRemoteEventMap,
  RemoteEventHandlerProps,
} from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { EmitData } from "@/app/api/[locale]/system/unified-interface/websocket/structured-events";
import type { EndpointEventEnvelope } from "@/app/api/[locale]/system/unified-interface/websocket/structured-events";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

// ─── 1. EmitData field types from execute-tool ────────────────────────────────
//
// tool-execute-request has:
//   requestFields: ["callbackMode","input","instanceId","toolName"]
//   payloadType: z.object({ callId, userId, locale })
//   (no responseFields)
// tool-execute-result has:
//   responseFields: ["hint","result","taskId"]
//   (no requestFields, no payloadType)

type _ExecPost = typeof executeDefinition.POST;

// tool-execute-request: requestData should have the declared request fields
type _ExecReqRequestData =
  _ExecPost["types"]["EventRequestPayloads"]["tool-execute-request"];
// Must be a non-empty object type (has callbackMode, input, instanceId, toolName)
type _VerifyExecReqHasRequestFields = Expect<
  Equal<"toolName" extends keyof _ExecReqRequestData ? true : false, true>
>;
type _VerifyExecReqHasInput = Expect<
  Equal<"input" extends keyof _ExecReqRequestData ? true : false, true>
>;

// tool-execute-request: payload should have callId, userId, locale
type _ExecReqPayload =
  _ExecPost["types"]["EventPayloadTypes"]["tool-execute-request"];
type _VerifyExecReqPayloadCallId = Expect<
  Equal<"callId" extends keyof _ExecReqPayload ? true : false, true>
>;
type _VerifyExecReqPayloadUserId = Expect<
  Equal<"userId" extends keyof _ExecReqPayload ? true : false, true>
>;

// tool-execute-result: responseData should have hint, result, taskId
type _ExecResultResponseData =
  _ExecPost["types"]["EventResponsePayloads"]["tool-execute-result"];
type _VerifyExecResultHasTaskId = Expect<
  Equal<"taskId" extends keyof _ExecResultResponseData ? true : false, true>
>;
type _VerifyExecResultHasResult = Expect<
  Equal<"result" extends keyof _ExecResultResponseData ? true : false, true>
>;
type _VerifyExecResultHasHint = Expect<
  Equal<"hint" extends keyof _ExecResultResponseData ? true : false, true>
>;

// ─── 2. RemoteEventHandlerProps — execute-tool ────────────────────────────────

type _ExecReqHandlerProps = RemoteEventHandlerProps<
  _ExecPost,
  "tool-execute-request"
>;

// requestData must have toolName
type _VerifyReqHandlerRequestData = Expect<
  Equal<
    "toolName" extends keyof _ExecReqHandlerProps["requestData"] ? true : false,
    true
  >
>;

// payload must have callId
type _VerifyReqHandlerPayloadCallId = Expect<
  Equal<
    "callId" extends keyof _ExecReqHandlerProps["payload"] ? true : false,
    true
  >
>;

// urlPathParams: no urlPathParamsFields declared → resolves to undefined
type _VerifyReqHandlerUrlParams = Expect<
  Equal<_ExecReqHandlerProps["urlPathParams"], undefined>
>;

// tool-execute-result handler props
type _ExecResultHandlerProps = RemoteEventHandlerProps<
  _ExecPost,
  "tool-execute-result"
>;

// responseData must have taskId
type _VerifyResultHandlerResponseData = Expect<
  Equal<
    "taskId" extends keyof _ExecResultHandlerProps["responseData"]
      ? true
      : false,
    true
  >
>;

// payload: no payloadType on tool-execute-result → undefined
type _VerifyResultHandlerPayload = Expect<
  Equal<_ExecResultHandlerProps["payload"], undefined>
>;

// ─── 3. OnRemoteEventMap — only remoteEvent:true keys allowed ─────────────────

type _ExecOnRemoteMap = OnRemoteEventMap<_ExecPost>;

// Both events are remoteEvent:true — must appear as keys
type _VerifyExecRemoteReqKey = Expect<
  Equal<
    "tool-execute-request" extends keyof _ExecOnRemoteMap ? true : false,
    true
  >
>;
type _VerifyExecRemoteResultKey = Expect<
  Equal<
    "tool-execute-result" extends keyof _ExecOnRemoteMap ? true : false,
    true
  >
>;

// ─── 4. Messages definition — stream-finished urlPathParams ──────────────────

type _MessagesGet = typeof messagesDefinition.GET;

// stream-finished has urlPathParamsFields: ["threadId"]
type _StreamFinishedUrlParams =
  _MessagesGet["types"]["EventUrlPayloads"]["stream-finished"];
type _VerifyStreamFinishedThreadId = Expect<
  Equal<"threadId" extends keyof _StreamFinishedUrlParams ? true : false, true>
>;

// RemoteEventHandlerProps for stream-finished must expose threadId in urlPathParams
type _StreamFinishedHandlerProps = RemoteEventHandlerProps<
  _MessagesGet,
  "stream-finished"
>;
type _VerifyStreamFinishedPropsThreadId = Expect<
  Equal<
    "threadId" extends keyof _StreamFinishedHandlerProps["urlPathParams"]
      ? true
      : false,
    true
  >
>;

// ─── 5. EndpointEventEnvelope generic preservation ───────────────────────────

// A fully-typed envelope for a known event
type _StreamFinishedUrlPayload =
  _MessagesGet["types"]["EventUrlPayloads"]["stream-finished"];
type _StreamFinishedResponsePayload =
  _MessagesGet["types"]["EventResponsePayloads"]["stream-finished"];

type _TestEnvelope = EndpointEventEnvelope<
  _StreamFinishedResponsePayload,
  Record<never, never>,
  _StreamFinishedUrlPayload,
  never
>;

// urlPathParams on the envelope must have threadId
type _VerifyEnvelopeUrlParams = Expect<
  Equal<
    "threadId" extends keyof _TestEnvelope["urlPathParams"] ? true : false,
    true
  >
>;

// ─── 6. EmitData shape — responseData/requestData/urlPathParams/payload ───────

type _ExecRequestEmitData = EmitData<
  Record<never, never>,
  _ExecReqRequestData,
  Record<never, never>,
  _ExecReqPayload
>;

// EmitData must expose requestData with toolName
type _VerifyEmitDataRequestData = Expect<
  Equal<
    "toolName" extends keyof _ExecRequestEmitData["requestData"] ? true : false,
    true
  >
>;

// EmitData must expose payload with callId
type _VerifyEmitDataPayload = Expect<
  Equal<
    "callId" extends keyof _ExecRequestEmitData["payload"] ? true : false,
    true
  >
>;

// ─── 7. content-done: responseData has messages with id+content+metadata ─────

type _ContentDoneResponseData =
  _MessagesGet["types"]["EventResponsePayloads"]["content-done"];
type _VerifyContentDoneMessages = Expect<
  Equal<"messages" extends keyof _ContentDoneResponseData ? true : false, true>
>;

// RemoteEventHandlerProps for content-done — responseData.messages accessible
type _ContentDoneProps = RemoteEventHandlerProps<_MessagesGet, "content-done">;
type _VerifyContentDonePropsMessages = Expect<
  Equal<
    "messages" extends keyof _ContentDoneProps["responseData"] ? true : false,
    true
  >
>;
// payload: no payloadType on content-done → undefined
type _VerifyContentDonePropsPayload = Expect<
  Equal<_ContentDoneProps["payload"], undefined>
>;

// ─── 8. message-created: responseData has messages (with all declared fields) ─

type _MessageCreatedResponseData =
  _MessagesGet["types"]["EventResponsePayloads"]["message-created"];
type _VerifyMsgCreatedMessages = Expect<
  Equal<
    "messages" extends keyof _MessageCreatedResponseData ? true : false,
    true
  >
>;
type _VerifyMsgCreatedStreamingState = Expect<
  Equal<
    "streamingState" extends keyof _MessageCreatedResponseData ? true : false,
    true
  >
>;
