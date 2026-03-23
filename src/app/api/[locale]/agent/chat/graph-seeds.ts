/**
 * Chat/AI Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the chat/AI domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { EVALUATOR_THRESHOLD_ALIAS } from "../../analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "../../analytics/indicators/ema/constants";
import { WINDOW_AVG_ALIAS } from "../../analytics/indicators/window-avg/constants";
import { TRANSFORMER_RATIO_ALIAS } from "../../analytics/transformers/ratio/constants";
import { COMPLETE_TASK_ALIAS } from "../../system/unified-interface/tasks/complete-task/constants";
import { GraphResolution } from "../../system/unified-interface/vibe-sense/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "../../system/unified-interface/vibe-sense/graph/types";
import { CHAT_DOWNVOTES_TOTAL_ALIAS } from "./data-sources/chat-downvotes-total/constants";
import { CHAT_ERRORS_TOTAL_ALIAS } from "./data-sources/chat-errors-total/constants";
import { CHAT_MEMORIES_CREATED_ALIAS } from "./data-sources/chat-memories-created/constants";
import { CHAT_MESSAGES_BY_AI_ALIAS } from "./data-sources/chat-messages-by-ai/constants";
import { CHAT_MESSAGES_BY_USER_ALIAS } from "./data-sources/chat-messages-by-user/constants";
import { CHAT_MESSAGES_TOTAL_ALIAS } from "./data-sources/chat-messages-total/constants";
import { CHAT_MESSAGES_WITH_ATTACHMENTS_ALIAS } from "./data-sources/chat-messages-with-attachments/constants";
import { CHAT_SHARE_LINKS_CREATED_ALIAS } from "./data-sources/chat-share-links-created/constants";
import { CHAT_THREADS_ACTIVE_TOTAL_ALIAS } from "./data-sources/chat-threads-active-total/constants";
import { CHAT_THREADS_CREATED_ALIAS } from "./data-sources/chat-threads-created/constants";
import { CHAT_TOOL_CALLS_TOTAL_ALIAS } from "./data-sources/chat-tool-calls-total/constants";
import { CHAT_UNIQUE_USERS_ALIAS } from "./data-sources/chat-unique-users/constants";
import { CHAT_UPVOTES_TOTAL_ALIAS } from "./data-sources/chat-upvotes-total/constants";

// ─── Color palette ──────────────────────────────────────────────────────────

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#ef4444";
const ORANGE = "#ea580c";
const PURPLE = "#9333ea";
const CYAN = "#0891b2";
const AMBER = "#ca8a04";

// ─── AI Engagement Overview ─────────────────────────────────────────────────

const aiEngagementOverviewConfig: GraphConfig = {
  nodes: {
    messages_total: {
      endpointPath: CHAT_MESSAGES_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    messages_by_user: {
      endpointPath: CHAT_MESSAGES_BY_USER_ALIAS,
      pane: 0,
      color: GREEN,
    },
    messages_by_ai: {
      endpointPath: CHAT_MESSAGES_BY_AI_ALIAS,
      pane: 0,
      color: CYAN,
    },
    threads_created: {
      endpointPath: CHAT_THREADS_CREATED_ALIAS,
      pane: 0,
      color: PURPLE,
    },
    unique_users: {
      endpointPath: CHAT_UNIQUE_USERS_ALIAS,
      pane: 0,
      color: ORANGE,
    },

    messages_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },
    threads_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: PURPLE,
    },

    msgs_per_thread: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
    },
    user_to_ai_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },

    eval_engagement_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 5 },
      visible: false,
    },
    eval_zero_threads: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: "<", value: 1 },
      visible: false,
    },

    action_notify_engagement_drop: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: AI message volume (7-day EMA) dropped below 5/day. User engagement is critically low. Review AI model quality and UX.",
      },
    },
  },

  edges: [
    { from: "messages_total", to: "messages_ema7" },
    { from: "threads_created", to: "threads_ema7" },
    { from: "messages_total", to: "msgs_per_thread", toHandle: "a" },
    { from: "threads_created", to: "msgs_per_thread", toHandle: "b" },
    { from: "messages_by_user", to: "user_to_ai_ratio", toHandle: "a" },
    { from: "messages_by_ai", to: "user_to_ai_ratio", toHandle: "b" },
    { from: "messages_ema7", to: "eval_engagement_drop" },
    { from: "threads_ema7", to: "eval_zero_threads" },
    { from: "eval_engagement_drop", to: "action_notify_engagement_drop" },
  ],

  positions: {
    messages_total: { x: 0, y: 0 },
    messages_by_user: { x: 0, y: 120 },
    messages_by_ai: { x: 0, y: 240 },
    threads_created: { x: 0, y: 360 },
    unique_users: { x: 0, y: 480 },
    messages_ema7: { x: 300, y: 0 },
    threads_ema7: { x: 300, y: 360 },
    msgs_per_thread: { x: 300, y: 180 },
    user_to_ai_ratio: { x: 300, y: 120 },
    eval_engagement_drop: { x: 600, y: 0 },
    eval_zero_threads: { x: 600, y: 360 },
    action_notify_engagement_drop: { x: 900, y: 0 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── AI Quality & Satisfaction ──────────────────────────────────────────────

const aiQualitySatisfactionConfig: GraphConfig = {
  nodes: {
    upvotes: {
      endpointPath: CHAT_UPVOTES_TOTAL_ALIAS,
      pane: 0,
      color: GREEN,
    },
    downvotes: {
      endpointPath: CHAT_DOWNVOTES_TOTAL_ALIAS,
      pane: 0,
      color: RED,
    },
    errors: {
      endpointPath: CHAT_ERRORS_TOTAL_ALIAS,
      pane: 0,
      color: ORANGE,
    },
    messages_total: {
      endpointPath: CHAT_MESSAGES_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },

    satisfaction_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    error_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: RED,
    },
    satisfaction_w7: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 1,
      color: GREEN,
    },
    error_rate_w7: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 1,
      color: RED,
    },

    eval_low_satisfaction: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.5 },
      visible: false,
    },
    eval_high_errors: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.1 },
      visible: false,
    },

    action_notify_quality_issue: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: AI satisfaction ratio (upvotes/total votes) dropped below 50% over 7 days. Users are consistently unhappy with AI responses. Review model selection, prompts, and recent changes.",
      },
    },
    action_notify_error_spike: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: AI error rate exceeded 10% of messages today. Possible API outage, model failure, or rate limiting. Check provider status and error logs.",
      },
    },
  },

  edges: [
    { from: "upvotes", to: "satisfaction_ratio", toHandle: "a" },
    { from: "downvotes", to: "satisfaction_ratio", toHandle: "b" },
    { from: "errors", to: "error_rate", toHandle: "a" },
    { from: "messages_total", to: "error_rate", toHandle: "b" },
    { from: "satisfaction_ratio", to: "satisfaction_w7" },
    { from: "error_rate", to: "error_rate_w7" },
    { from: "satisfaction_w7", to: "eval_low_satisfaction" },
    { from: "error_rate_w7", to: "eval_high_errors" },
    { from: "eval_low_satisfaction", to: "action_notify_quality_issue" },
    { from: "eval_high_errors", to: "action_notify_error_spike" },
  ],

  positions: {
    upvotes: { x: 0, y: 0 },
    downvotes: { x: 0, y: 120 },
    errors: { x: 0, y: 240 },
    messages_total: { x: 0, y: 360 },
    satisfaction_ratio: { x: 300, y: 60 },
    error_rate: { x: 300, y: 300 },
    satisfaction_w7: { x: 560, y: 60 },
    error_rate_w7: { x: 560, y: 300 },
    eval_low_satisfaction: { x: 800, y: 60 },
    eval_high_errors: { x: 800, y: 300 },
    action_notify_quality_issue: { x: 1060, y: 60 },
    action_notify_error_spike: { x: 1060, y: 300 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── AI Feature Adoption ────────────────────────────────────────────────────

const aiFeatureAdoptionConfig: GraphConfig = {
  nodes: {
    tool_calls: {
      endpointPath: CHAT_TOOL_CALLS_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    attachments: {
      endpointPath: CHAT_MESSAGES_WITH_ATTACHMENTS_ALIAS,
      pane: 0,
      color: GREEN,
    },
    memories: {
      endpointPath: CHAT_MEMORIES_CREATED_ALIAS,
      pane: 0,
      color: PURPLE,
    },
    share_links: {
      endpointPath: CHAT_SHARE_LINKS_CREATED_ALIAS,
      pane: 0,
      color: CYAN,
    },
    messages_total: {
      endpointPath: CHAT_MESSAGES_TOTAL_ALIAS,
      pane: 0,
      color: AMBER,
    },

    tool_calls_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },

    tool_usage_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: BLUE,
    },
    attachment_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },

    eval_tool_adoption_low: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.01 },
      visible: false,
    },
  },

  edges: [
    { from: "tool_calls", to: "tool_calls_ema7" },
    { from: "tool_calls", to: "tool_usage_rate", toHandle: "a" },
    { from: "messages_total", to: "tool_usage_rate", toHandle: "b" },
    { from: "attachments", to: "attachment_rate", toHandle: "a" },
    { from: "messages_total", to: "attachment_rate", toHandle: "b" },
    { from: "tool_usage_rate", to: "eval_tool_adoption_low" },
  ],

  positions: {
    tool_calls: { x: 0, y: 0 },
    attachments: { x: 0, y: 120 },
    memories: { x: 0, y: 240 },
    share_links: { x: 0, y: 360 },
    messages_total: { x: 0, y: 480 },
    tool_calls_ema7: { x: 300, y: 0 },
    tool_usage_rate: { x: 300, y: 240 },
    attachment_rate: { x: 300, y: 120 },
    eval_tool_adoption_low: { x: 600, y: 240 },
  },

  trigger: { type: "cron", schedule: "0 0 * * *" },
};

// ─── AI Session Depth ────────────────────────────────────────────────────────

const aiSessionDepthConfig: GraphConfig = {
  nodes: {
    threads_active: {
      endpointPath: CHAT_THREADS_ACTIVE_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
    },
    threads_created: {
      endpointPath: CHAT_THREADS_CREATED_ALIAS,
      pane: 0,
      color: GREEN,
    },
    messages_total: {
      endpointPath: CHAT_MESSAGES_TOTAL_ALIAS,
      pane: 0,
      color: CYAN,
    },
    unique_users: {
      endpointPath: CHAT_UNIQUE_USERS_ALIAS,
      pane: 0,
      color: PURPLE,
    },

    active_threads_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: BLUE,
    },

    msgs_per_active_thread: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
    },
    active_to_created_ratio: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
    },
    threads_per_user: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
    },

    eval_low_active_threads: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 3 },
      visible: false,
    },
    eval_shallow_sessions: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 2 },
      visible: false,
    },

    action_notify_low_active: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: Active thread count (7-day EMA) dropped below 3. Users are not returning to conversations. Review session continuity and AI response quality.",
      },
    },
  },

  edges: [
    { from: "threads_active", to: "active_threads_ema7" },
    { from: "messages_total", to: "msgs_per_active_thread", toHandle: "a" },
    { from: "threads_active", to: "msgs_per_active_thread", toHandle: "b" },
    { from: "threads_active", to: "active_to_created_ratio", toHandle: "a" },
    { from: "threads_created", to: "active_to_created_ratio", toHandle: "b" },
    { from: "threads_active", to: "threads_per_user", toHandle: "a" },
    { from: "unique_users", to: "threads_per_user", toHandle: "b" },
    { from: "active_threads_ema7", to: "eval_low_active_threads" },
    { from: "msgs_per_active_thread", to: "eval_shallow_sessions" },
    { from: "eval_low_active_threads", to: "action_notify_low_active" },
  ],

  positions: {
    threads_active: { x: 0, y: 0 },
    threads_created: { x: 0, y: 120 },
    messages_total: { x: 0, y: 240 },
    unique_users: { x: 0, y: 360 },
    active_threads_ema7: { x: 300, y: 0 },
    msgs_per_active_thread: { x: 300, y: 120 },
    active_to_created_ratio: { x: 300, y: 240 },
    threads_per_user: { x: 300, y: 360 },
    eval_low_active_threads: { x: 600, y: 0 },
    eval_shallow_sessions: { x: 600, y: 120 },
    action_notify_low_active: { x: 900, y: 0 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const graphSeeds: GraphSeedEntry[] = [
  {
    slug: "ai-engagement-overview",
    name: "AI Engagement Overview",
    description:
      "Tracks AI message volume, thread creation, unique users, messages per thread, and user-to-AI ratio. Alerts on engagement drops.",
    config: aiEngagementOverviewConfig,
  },
  {
    slug: "ai-quality-satisfaction",
    name: "AI Quality & Satisfaction",
    description:
      "Monitors upvote/downvote satisfaction ratio and AI error rate with 7-day smoothing. Alerts on quality drops and error spikes.",
    config: aiQualitySatisfactionConfig,
  },
  {
    slug: "ai-feature-adoption",
    name: "AI Feature Adoption",
    description:
      "Tracks tool call usage, file attachments, memory creation, and share links. Measures feature adoption rates against total messages.",
    config: aiFeatureAdoptionConfig,
  },
  {
    slug: "ai-session-depth",
    name: "AI Session Depth",
    description:
      "Tracks active thread retention, messages per active thread, active-to-created ratio, and threads per user. Alerts on low active threads and shallow sessions.",
    config: aiSessionDepthConfig,
  },
];
