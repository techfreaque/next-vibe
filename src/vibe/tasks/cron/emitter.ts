/**
 * Cron Task Event Emitter
 *
 * Broadcasts task state changes to both the task list and queue WS channels.
 * Any UI subscribed to either endpoint gets live updates automatically.
 */

import "server-only";

import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { createEndpointEmitter } from "../../realtime/core/emitter";
import type { EmitEventNamed } from "../../realtime/core/structured-events";
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
