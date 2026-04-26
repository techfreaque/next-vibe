/**
 * Cron Task Event Emitter
 *
 * Broadcasts task state changes to both the task list and queue WS channels.
 * Any UI subscribed to either endpoint gets live updates automatically.
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/endpoint-emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import queueDefinitions from "./queue/definition";
import tasksDefinitions from "./tasks/definition";

/**
 * Create emitters for both task list and queue channels.
 * Returns a function that broadcasts to both simultaneously.
 */
export function createTaskEmitters(
  logger: EndpointLogger,
  user: JwtPayloadType,
): {
  emitTaskList: ReturnType<
    typeof createEndpointEmitter<
      typeof tasksDefinitions.GET.types.EventPayloads
    >
  >;
  emitTaskQueue: ReturnType<
    typeof createEndpointEmitter<
      typeof queueDefinitions.GET.types.EventPayloads
    >
  >;
} {
  return {
    emitTaskList: createEndpointEmitter(tasksDefinitions.GET, logger, user),
    emitTaskQueue: createEndpointEmitter(queueDefinitions.GET, logger, user),
  };
}
