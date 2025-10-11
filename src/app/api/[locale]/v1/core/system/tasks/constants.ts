/**
 * Task System Constants
 * Central location for common cron schedules and task configuration
 */

/**
 * Common Cron Schedule Patterns
 * These constants help avoid literal string lint errors and provide consistency
 */
export const CRON_SCHEDULES = {
  // Frequent intervals
  EVERY_MINUTE: "* * * * *",
  EVERY_3_MINUTES: "*/3 * * * *",
  EVERY_5_MINUTES: "*/5 * * * *",
  EVERY_15_MINUTES: "*/15 * * * *",
  EVERY_30_MINUTES: "*/30 * * * *",

  // Hourly intervals
  EVERY_HOUR: "0 * * * *",
  EVERY_2_HOURS: "0 */2 * * *",
  EVERY_3_HOURS: "0 */3 * * *",
  EVERY_6_HOURS: "0 */6 * * *",
  EVERY_12_HOURS: "0 */12 * * *",

  // Daily intervals
  DAILY_MIDNIGHT: "0 0 * * *",
  DAILY_6AM: "0 6 * * *",
  DAILY_NOON: "0 12 * * *",
  DAILY_6PM: "0 18 * * *",

  // Weekly intervals
  WEEKLY_SUNDAY_MIDNIGHT: "0 0 * * 0",
  WEEKLY_MONDAY_6AM: "0 6 * * 1",

  // Monthly intervals
  MONTHLY_FIRST_DAY: "0 0 1 * *",
  MONTHLY_LAST_DAY: "0 0 L * *",
} as const;

/**
 * Task Priority Weights for Sorting
 * Higher numbers indicate higher priority
 */
export const TASK_PRIORITY_WEIGHTS = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  BACKGROUND: 1,
} as const;

/**
 * Default Task Timeouts (in milliseconds)
 */
export const TASK_TIMEOUTS = {
  SHORT: 60000, // 1 minute
  MEDIUM: 300000, // 5 minutes
  LONG: 600000, // 10 minutes
  EXTENDED: 1800000, // 30 minutes
  MAXIMUM: 3600000, // 1 hour
} as const;

/**
 * Default Retry Configuration
 */
export const TASK_RETRY_CONFIG = {
  DEFAULT_RETRIES: 3,
  DEFAULT_RETRY_DELAY: 5000, // 5 seconds
  MAX_RETRIES: 5,
  MIN_RETRY_DELAY: 1000, // 1 second
  MAX_RETRY_DELAY: 30000, // 30 seconds
} as const;

/**
 * Task Batch Sizes
 */
export const TASK_BATCH_SIZES = {
  SMALL: 10,
  MEDIUM: 50,
  LARGE: 100,
  EXTRA_LARGE: 500,
  MAXIMUM: 1000,
} as const;
