/**
 * Cron Task Event Emitter
 *
 * Broadcasts task state changes to both the task list and queue WS channels.
 * Any UI subscribed to either endpoint gets live updates automatically.
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { EmitEventNamed } from "../../websocket/structured-events";
import queueDefinitions from "./queue/definition";
import tasksDefinitions from "./tasks/definition";

type TaskListEmitter = EmitEventNamed<
  (typeof tasksDefinitions)["GET"]["types"]["EventResponsePayloads"],
  (typeof tasksDefinitions)["GET"]["types"]["EventRequestPayloads"],
  (typeof tasksDefinitions)["GET"]["types"]["EventUrlPayloads"],
  (typeof tasksDefinitions)["GET"]["types"]["EventPayloadTypes"]
>;

type TaskQueueEmitter = EmitEventNamed<
  (typeof queueDefinitions)["GET"]["types"]["EventResponsePayloads"],
  (typeof queueDefinitions)["GET"]["types"]["EventRequestPayloads"],
  (typeof queueDefinitions)["GET"]["types"]["EventUrlPayloads"],
  (typeof queueDefinitions)["GET"]["types"]["EventPayloadTypes"]
>;

/**
 * Create emitters for both task list and queue channels.
 * Returns a function that broadcasts to both simultaneously.
 */
export function createTaskEmitters(
  logger: EndpointLogger,
  user: JwtPayloadType,
): {
  emitTaskList: TaskListEmitter;
  emitTaskQueue: TaskQueueEmitter;
} {
  return {
    emitTaskList: createEndpointEmitter(tasksDefinitions.GET, logger, user),
    emitTaskQueue: createEndpointEmitter(queueDefinitions.GET, logger, user),
  };
}
