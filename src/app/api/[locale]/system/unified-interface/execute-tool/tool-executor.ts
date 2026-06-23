/**
 * Incoming Tool Executor — shared executor for tool-execute-request events.
 *
 * Two delivery paths reach it (channel/spec.md → Tool Dispatch Events):
 *   1. WsConnection (connector.ts): we hold an outbound WS to the remote and
 *      receive requests published on the REMOTE's hub channel.
 *   2. WS server (websocket/server.ts): the remote holds the outbound WS to
 *      us and SENDS the request over that socket — the server routes
 *      authenticated server-to-server wire messages here.
 *
 * Both paths execute locally and POST the result back to the requester's
 * /system/unified-interface/execute-tool/complete with the revival context echoed
 * (remote-call/spec.md → No Remote Tasks).
 */

import "server-only";

import { z } from "zod";

import { makeHeadlessContext } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { WidgetDataSchema } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { dbUserIdToOwner } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues, defaultLocale } from "@/i18n/core/config";

/**
 * Wire schema for TOOL_EXECUTE_REQUEST events. Every inbound payload is
 * validated against this before handling — invalid payloads are logged and
 * dropped, never cast (channel/spec.md → Wire Format).
 */
export const ToolExecuteRequestSchema = z.object({
  callId: z.string().min(1),
  toolName: z.string().min(1),
  args: z.record(z.string(), WidgetDataSchema),
  wakeUpCallbackMode: z.string().nullable(),
  wakeUpThreadId: z.string().nullable(),
  wakeUpToolMessageId: z.string().nullable(),
  wakeUpLeafMessageId: z.string().nullable(),
  wakeUpModelId: z.string().nullable(),
  wakeUpSkillId: z.string().nullable(),
  wakeUpFavoriteId: z.string().nullable(),
  wakeUpSubAgentDepth: z.number(),
  userId: z.string().min(1),
  locale: z.enum(CountryLanguageValues),
});

export type ToolExecuteRequestData = z.infer<typeof ToolExecuteRequestSchema>;

/** Where to POST the result report (the requester's instance). */
export interface ToolReportTarget {
  remoteUrl: string;
  token: string;
  leadId: string;
}

/** Result of a locally-executed incoming tool request. */
export interface ToolExecutionOutcome {
  callId: string;
  status: "completed" | "failed";
  output: Record<string, WidgetData> | null;
  summary: string;
  durationMs: number;
}

/**
 * Execute an incoming tool request locally and deliver the result.
 * Definite-outcome: every request produces exactly one delivery —
 *   wait/endLoop  → the caller replies on the SAME socket (skipReport=true;
 *                   the transport layer sends tool-execute-result back)
 *   wakeUp/detach → POST /report to the requester (revival context echoed)
 */
export async function executeIncomingToolRequest(params: {
  req: ToolExecuteRequestData;
  reportTo: ToolReportTarget;
  executedByInstance: string;
  logger: EndpointLogger;
  /**
   * The LOCAL user to execute as. req.userId is the REQUESTER's user id in
   * ITS OWN database — instances do not share user ids. The wakeUpContext
   * echo keeps req.userId so the requester's revival resolves correctly.
   */
  localUserId?: string;
  /** True when the transport layer delivers the result itself (socket reply). */
  skipReport?: boolean;
}): Promise<ToolExecutionOutcome> {
  const { req, reportTo, executedByInstance, logger, localUserId, skipReport } =
    params;

  logger.info("[ToolExecutor] Executing incoming tool request", {
    toolName: req.toolName,
    callId: req.callId,
  });

  const { RouteExecutionExecutor } =
    await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");
  const { resolveTaskOwnerUser } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/resolve-task-user");

  const locale: CountryLanguage = defaultLocale;
  const startedAt = new Date();

  const owner = dbUserIdToOwner(localUserId ?? req.userId);
  const taskUserCtx = await resolveTaskOwnerUser(owner, locale, logger);
  if (!taskUserCtx) {
    logger.warn("[ToolExecutor] Failed to resolve owner user", {
      userId: req.userId,
    });
    const failedOutcome: ToolExecutionOutcome = {
      callId: req.callId,
      status: "failed",
      output: null,
      summary: "Failed to resolve owner user",
      durationMs: Date.now() - startedAt.getTime(),
    };
    if (!skipReport) {
      await postToolReport(reportTo, logger, {
        taskId: req.callId,
        status: CronTaskStatus.FAILED,
        summary: failedOutcome.summary,
        durationMs: failedOutcome.durationMs,
        startedAt: startedAt.toISOString(),
        executedByInstance,
        wakeUpContext: buildWakeUpContext(req),
      });
    }
    return failedOutcome;
  }

  const ownerUser: JwtPrivatePayloadType = taskUserCtx.user;

  let output: Record<string, WidgetData> | undefined;
  let status: typeof CronTaskStatus.COMPLETED | typeof CronTaskStatus.FAILED =
    CronTaskStatus.FAILED;
  let summary = "Tool execution failed";

  const abortController = new AbortController();
  try {
    const response =
      await RouteExecutionExecutor.executeGenericHandler<WidgetData>({
        toolName: req.toolName,
        data: req.args,
        user: ownerUser,
        locale,
        logger,
        platform: Platform.AI,
        streamContext: {
          ...makeHeadlessContext(abortController.signal),
          threadId: req.wakeUpThreadId ?? undefined,
          currentToolMessageId: req.wakeUpToolMessageId ?? undefined,
          leafMessageId: req.wakeUpLeafMessageId ?? undefined,
          favoriteId: req.wakeUpFavoriteId ?? undefined,
          skillId: req.wakeUpSkillId ?? undefined,
          subAgentDepth: req.wakeUpSubAgentDepth,
        },
      });

    if (response.success) {
      output = response.data as Record<string, WidgetData>;
      status = CronTaskStatus.COMPLETED;
      summary = "Tool executed successfully";
    } else {
      summary =
        "message" in response
          ? String(response.message)
          : "Tool execution failed";
    }
  } catch (err) {
    summary = err instanceof Error ? err.message : String(err);
    logger.warn("[ToolExecutor] Tool execution threw", {
      toolName: req.toolName,
      error: summary,
    });
  }

  logger.info("[ToolExecutor] Tool execution finished", {
    toolName: req.toolName,
    callId: req.callId,
    status,
    durationMs: Date.now() - startedAt.getTime(),
    delivery: skipReport ? "socket-reply" : "report",
  });

  if (!skipReport) {
    await postToolReport(reportTo, logger, {
      taskId: req.callId,
      status,
      summary,
      output,
      durationMs: Date.now() - startedAt.getTime(),
      startedAt: startedAt.toISOString(),
      executedByInstance,
      wakeUpContext: buildWakeUpContext(req),
    });
  }

  return {
    callId: req.callId,
    status: status === CronTaskStatus.COMPLETED ? "completed" : "failed",
    output: output ?? null,
    summary,
    durationMs: Date.now() - startedAt.getTime(),
  };
}

/** Echo the revival context back so the caller revives without a task row. */
function buildWakeUpContext(req: ToolExecuteRequestData): {
  callbackMode: string | null;
  threadId: string | null;
  toolMessageId: string | null;
  leafMessageId: string | null;
  modelId: string | null;
  skillId: string | null;
  favoriteId: string | null;
  subAgentDepth: number;
  userId: string;
} {
  return {
    callbackMode: req.wakeUpCallbackMode,
    threadId: req.wakeUpThreadId,
    toolMessageId: req.wakeUpToolMessageId,
    leafMessageId: req.wakeUpLeafMessageId,
    modelId: req.wakeUpModelId,
    skillId: req.wakeUpSkillId,
    favoriteId: req.wakeUpFavoriteId,
    subAgentDepth: req.wakeUpSubAgentDepth,
    userId: req.userId,
  };
}

async function postToolReport(
  reportTo: ToolReportTarget,
  logger: EndpointLogger,
  payload: {
    taskId: string;
    status: string;
    summary: string;
    output?: Record<string, WidgetData>;
    durationMs: number;
    startedAt: string;
    executedByInstance?: string | null;
    wakeUpContext?: {
      callbackMode: string | null;
      threadId: string | null;
      toolMessageId: string | null;
      leafMessageId: string | null;
      modelId: string | null;
      skillId: string | null;
      favoriteId: string | null;
      subAgentDepth: number;
      userId: string;
    };
  },
): Promise<void> {
  const { endpoints: reportEndpoints } =
    await import("@/app/api/[locale]/system/unified-interface/execute-tool/complete/definition");
  const reportUrl = `${reportTo.remoteUrl.replace(/\/$/, "")}/api/${defaultLocale}/${reportEndpoints.POST.path.join("/")}`;

  try {
    const resp = await fetch(reportUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${reportTo.token}${BEARER_LEAD_ID_SEPARATOR}${reportTo.leadId}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });

    if (!resp.ok) {
      logger.warn("[ToolExecutor] Failed to POST /report", {
        taskId: payload.taskId,
        status: resp.status,
      });
    } else {
      logger.debug("[ToolExecutor] /report posted", {
        taskId: payload.taskId,
      });
    }
  } catch (err) {
    logger.warn("[ToolExecutor] Error posting /report", {
      taskId: payload.taskId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
