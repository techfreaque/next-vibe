import "server-only";

import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import {
  createCronTask,
  type Task,
} from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

import definitions from "./definition";
import { tools } from "./route";

const subscriptionReminderTask = createCronTask(definitions.POST, tools.POST, {
  id: "corvina-subscription-reminder",
  name: "post.title",
  description: "post.description",
  schedule: CRON_SCHEDULES.EVERY_MINUTE,
  category: TaskCategory.MAINTENANCE,
  enabled: true,
  hidden: false,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM,
  taskInput: undefined,
});

export const tasks: Task[] = [subscriptionReminderTask];
export default tasks;
