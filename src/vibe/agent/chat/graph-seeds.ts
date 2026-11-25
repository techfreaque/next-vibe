/**
 * Chat/AI Domain - Vibe Sense Graph Seeds
 *
 * Colocated pipeline graph seed definitions for the chat/AI domain.
 * Auto-discovered by the Graph Seeds Index Generator.
 */

/* eslint-disable i18next/no-literal-string */

import { GraphResolution } from "next-vibe/dataflow/enum";
import type {
  GraphConfig,
  GraphSeedEntry,
} from "next-vibe/dataflow/graph/types";
import { COMPLETE_TASK_ALIAS } from "next-vibe/execute-tool/complete/constants";

import { EVALUATOR_THRESHOLD_ALIAS } from "@/analytics/evaluators/threshold/constants";
import { EMA_ALIAS } from "@/analytics/indicators/ema/constants";
import { WINDOW_AVG_ALIAS } from "@/analytics/indicators/window-avg/constants";
import { TRANSFORMER_MERGE_ALIAS } from "@/analytics/transformers/merge/constants";
import { TRANSFORMER_RATIO_ALIAS } from "@/analytics/transformers/ratio/constants";
import { CREDITS_ACTIVE_SPENDERS_ALIAS } from "@/credits/data-sources/credits-active-spenders/constants";
import {
  SpenderKind,
  type SpenderKindValue,
} from "@/credits/data-sources/credits-active-spenders/enum";

import { CHAT_DOWNVOTES_TOTAL_ALIAS } from "./data-sources/chat-downvotes-total/constants";
import { CHAT_ERRORS_TOTAL_ALIAS } from "./data-sources/chat-errors-total/constants";
import { CHAT_MEMORIES_CREATED_ALIAS } from "./data-sources/chat-memories-created/constants";
import { CHAT_MESSAGES_BY_AI_ALIAS } from "./data-sources/chat-messages-by-ai/constants";
import { CHAT_MESSAGES_BY_USER_ALIAS } from "./data-sources/chat-messages-by-user/constants";
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
// Who uses AI and how much. People come from the credit ledger (covers
// incognito, which is never stored); messages from stored human chats only.

const spenders = (
  who: typeof SpenderKindValue,
  color: string,
): GraphConfig["nodes"][string] => ({
  endpointPath: CREDITS_ACTIVE_SPENDERS_ALIAS,
  params: { who },
  pane: 0,
  color,
  scale: "right",
});

const aiEngagementOverviewConfig: GraphConfig = {
  nodes: {
    // Pane 0 = people per bucket
    ai_users_signed_in: spenders(SpenderKind.SIGNED_IN, BLUE),
    ai_users_guests: spenders(SpenderKind.GUESTS, ORANGE),
    chat_users_stored_chats: {
      endpointPath: CHAT_UNIQUE_USERS_ALIAS,
      pane: 0,
      color: PURPLE,
      scale: "right",
    },
    ai_users_total: {
      endpointPath: TRANSFORMER_MERGE_ALIAS,
      visible: false,
    },
    ai_users_total_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: GREEN,
      scale: "right",
    },

    // Pane 1 = stored chat messages per bucket
    user_messages: {
      endpointPath: CHAT_MESSAGES_BY_USER_ALIAS,
      pane: 1,
      color: GREEN,
      scale: "right",
    },
    ai_replies: {
      endpointPath: CHAT_MESSAGES_BY_AI_ALIAS,
      pane: 1,
      color: CYAN,
      scale: "right",
    },
    user_messages_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 1,
      color: AMBER,
      scale: "right",
    },

    // Pane 2 = user messages per signed-in chat user
    user_messages_per_chat_user: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 2,
      color: PURPLE,
      scale: "right",
    },

    eval_engagement_drop: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: "<", value: 5 },
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
          "ALERT: Fewer than 5 people per day used AI (7-day EMA of signed-in users + guests with a credit debit). Check model availability, the chat page and signup flow.",
      },
    },
  },

  edges: [
    { from: "ai_users_signed_in", to: "ai_users_total", toHandle: "a" },
    { from: "ai_users_guests", to: "ai_users_total", toHandle: "b" },
    { from: "ai_users_total", to: "ai_users_total_ema7" },
    { from: "user_messages", to: "user_messages_ema7" },
    { from: "user_messages", to: "user_messages_per_chat_user", toHandle: "a" },
    {
      from: "chat_users_stored_chats",
      to: "user_messages_per_chat_user",
      toHandle: "b",
    },
    { from: "ai_users_total_ema7", to: "eval_engagement_drop" },
    { from: "eval_engagement_drop", to: "action_notify_engagement_drop" },
  ],

  positions: {
    ai_users_signed_in: { x: 0, y: 0 },
    ai_users_guests: { x: 0, y: 120 },
    chat_users_stored_chats: { x: 0, y: 240 },
    user_messages: { x: 0, y: 360 },
    ai_replies: { x: 0, y: 480 },
    ai_users_total: { x: 300, y: 60 },
    ai_users_total_ema7: { x: 560, y: 60 },
    user_messages_ema7: { x: 300, y: 360 },
    user_messages_per_chat_user: { x: 300, y: 240 },
    eval_engagement_drop: { x: 800, y: 60 },
    action_notify_engagement_drop: { x: 1060, y: 60 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── AI Quality & Satisfaction ──────────────────────────────────────────────
// Error rate = failed AI turns / (replies + failed turns). Votes are rare
// (12 ever on prod by 2026-11-25), so they show as raw counts: a ratio over
// zero votes would read as 0% satisfied.

const aiQualitySatisfactionConfig: GraphConfig = {
  nodes: {
    // Pane 0 = AI turns per bucket
    ai_replies: {
      endpointPath: CHAT_MESSAGES_BY_AI_ALIAS,
      pane: 0,
      color: BLUE,
      scale: "right",
    },
    ai_failed_turns: {
      endpointPath: CHAT_ERRORS_TOTAL_ALIAS,
      pane: 0,
      color: RED,
      scale: "right",
    },
    ai_turns: {
      endpointPath: TRANSFORMER_MERGE_ALIAS,
      visible: false,
    },

    // Pane 1 = error rate (0..1)
    error_rate: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: ORANGE,
      scale: "right",
    },
    error_rate_w7: {
      endpointPath: WINDOW_AVG_ALIAS,
      params: { size: 7 },
      pane: 1,
      color: RED,
      scale: "right",
    },

    // Pane 2 = votes per bucket
    upvotes: {
      endpointPath: CHAT_UPVOTES_TOTAL_ALIAS,
      pane: 2,
      color: GREEN,
      scale: "right",
    },
    downvotes: {
      endpointPath: CHAT_DOWNVOTES_TOTAL_ALIAS,
      pane: 2,
      color: RED,
      scale: "right",
    },
    eval_high_errors: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_DAY,
      params: { op: ">", value: 0.1 },
      visible: false,
    },
    action_notify_error_spike: {
      endpointPath: COMPLETE_TASK_ALIAS,
      persist: "never",
      visible: false,
      params: {
        taskId: "vibe-sense-alert",
        status: "status.completed",
        summary:
          "ALERT: More than 10% of AI turns failed (7-day average). Possible provider outage, model failure or rate limiting. Check provider status and error logs.",
      },
    },
  },

  edges: [
    { from: "ai_replies", to: "ai_turns", toHandle: "a" },
    { from: "ai_failed_turns", to: "ai_turns", toHandle: "b" },
    { from: "ai_failed_turns", to: "error_rate", toHandle: "a" },
    { from: "ai_turns", to: "error_rate", toHandle: "b" },
    { from: "error_rate", to: "error_rate_w7" },
    { from: "error_rate_w7", to: "eval_high_errors" },
    { from: "eval_high_errors", to: "action_notify_error_spike" },
  ],

  positions: {
    ai_replies: { x: 0, y: 0 },
    ai_failed_turns: { x: 0, y: 120 },
    upvotes: { x: 0, y: 300 },
    downvotes: { x: 0, y: 420 },
    ai_turns: { x: 300, y: 0 },
    error_rate: { x: 560, y: 60 },
    error_rate_w7: { x: 800, y: 60 },
    eval_high_errors: { x: 1060, y: 60 },
    action_notify_error_spike: { x: 1300, y: 60 },
  },

  trigger: { type: "cron", schedule: "0 */6 * * *" },
};

// ─── AI Feature Adoption ────────────────────────────────────────────────────

const aiFeatureAdoptionConfig: GraphConfig = {
  nodes: {
    // Pane 0 = feature events per bucket
    tool_calls: {
      endpointPath: CHAT_TOOL_CALLS_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
      scale: "right",
    },
    messages_with_attachments: {
      endpointPath: CHAT_MESSAGES_WITH_ATTACHMENTS_ALIAS,
      pane: 0,
      color: GREEN,
      scale: "right",
    },
    memories_created: {
      endpointPath: CHAT_MEMORIES_CREATED_ALIAS,
      pane: 0,
      color: PURPLE,
      scale: "right",
    },
    share_links_created: {
      endpointPath: CHAT_SHARE_LINKS_CREATED_ALIAS,
      pane: 0,
      color: CYAN,
      scale: "right",
    },
    ai_replies: {
      endpointPath: CHAT_MESSAGES_BY_AI_ALIAS,
      visible: false,
    },
    user_messages: {
      endpointPath: CHAT_MESSAGES_BY_USER_ALIAS,
      visible: false,
    },

    // Pane 1 = rates
    tool_calls_per_ai_reply: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: BLUE,
      scale: "right",
    },
    attachment_share_of_user_messages: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: GREEN,
      scale: "right",
    },

    eval_tool_adoption_low: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 0.01 },
      visible: false,
    },
  },

  edges: [
    { from: "tool_calls", to: "tool_calls_per_ai_reply", toHandle: "a" },
    { from: "ai_replies", to: "tool_calls_per_ai_reply", toHandle: "b" },
    {
      from: "messages_with_attachments",
      to: "attachment_share_of_user_messages",
      toHandle: "a",
    },
    {
      from: "user_messages",
      to: "attachment_share_of_user_messages",
      toHandle: "b",
    },
    { from: "tool_calls_per_ai_reply", to: "eval_tool_adoption_low" },
  ],

  positions: {
    tool_calls: { x: 0, y: 0 },
    messages_with_attachments: { x: 0, y: 120 },
    memories_created: { x: 0, y: 240 },
    share_links_created: { x: 0, y: 360 },
    ai_replies: { x: 0, y: 480 },
    user_messages: { x: 0, y: 600 },
    tool_calls_per_ai_reply: { x: 300, y: 240 },
    attachment_share_of_user_messages: { x: 300, y: 120 },
    eval_tool_adoption_low: { x: 600, y: 240 },
  },

  trigger: { type: "cron", schedule: "0 0 * * *" },
};

// ─── AI Session Depth ────────────────────────────────────────────────────────

const aiSessionDepthConfig: GraphConfig = {
  nodes: {
    // Pane 0 = threads per bucket
    active_threads: {
      endpointPath: CHAT_THREADS_ACTIVE_TOTAL_ALIAS,
      pane: 0,
      color: BLUE,
      scale: "right",
    },
    new_threads: {
      endpointPath: CHAT_THREADS_CREATED_ALIAS,
      pane: 0,
      color: GREEN,
      scale: "right",
    },
    active_threads_ema7: {
      endpointPath: EMA_ALIAS,
      params: { period: 7 },
      pane: 0,
      color: CYAN,
      scale: "right",
    },
    user_messages: {
      endpointPath: CHAT_MESSAGES_BY_USER_ALIAS,
      visible: false,
    },
    chat_users: {
      endpointPath: CHAT_UNIQUE_USERS_ALIAS,
      visible: false,
    },

    // Pane 1 = depth ratios
    user_messages_per_active_thread: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: AMBER,
      scale: "right",
    },
    active_threads_per_chat_user: {
      endpointPath: TRANSFORMER_RATIO_ALIAS,
      pane: 1,
      color: PURPLE,
      scale: "right",
    },

    eval_low_active_threads: {
      endpointPath: EVALUATOR_THRESHOLD_ALIAS,
      resolution: GraphResolution.ONE_WEEK,
      params: { op: "<", value: 3 },
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
          "ALERT: Fewer than 3 stored chat threads got a user message this week (7-day EMA). Signed-in users are not chatting. Review chat UX and AI response quality.",
      },
    },
  },

  edges: [
    { from: "active_threads", to: "active_threads_ema7" },
    {
      from: "user_messages",
      to: "user_messages_per_active_thread",
      toHandle: "a",
    },
    {
      from: "active_threads",
      to: "user_messages_per_active_thread",
      toHandle: "b",
    },
    {
      from: "active_threads",
      to: "active_threads_per_chat_user",
      toHandle: "a",
    },
    { from: "chat_users", to: "active_threads_per_chat_user", toHandle: "b" },
    { from: "active_threads_ema7", to: "eval_low_active_threads" },
    { from: "eval_low_active_threads", to: "action_notify_low_active" },
  ],

  positions: {
    active_threads: { x: 0, y: 0 },
    new_threads: { x: 0, y: 120 },
    user_messages: { x: 0, y: 240 },
    chat_users: { x: 0, y: 360 },
    active_threads_ema7: { x: 300, y: 0 },
    user_messages_per_active_thread: { x: 300, y: 180 },
    active_threads_per_chat_user: { x: 300, y: 300 },
    eval_low_active_threads: { x: 600, y: 0 },
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
      "Pane 0: people using AI per day from the credit ledger (signed-in users, guests incl. incognito, bots and admins excluded) with a 7-day EMA, plus signed-in users of stored chats. Pane 1: user messages and AI replies in stored human chats (background agents, remote copies and admins excluded). Pane 2: user messages per chat user. Alerts when fewer than 5 people a day use AI.",
    config: aiEngagementOverviewConfig,
  },
  {
    slug: "ai-quality-satisfaction",
    name: "AI Quality & Satisfaction",
    description:
      "Pane 0: AI replies and failed AI turns in stored human chats. Pane 1: error rate (failed turns / all AI turns) with a 7-day average. Pane 2: upvotes and downvotes (raw counts; votes are rare, so no ratio). Alerts when more than 10% of AI turns fail.",
    config: aiQualitySatisfactionConfig,
  },
  {
    slug: "ai-feature-adoption",
    name: "AI Feature Adoption",
    description:
      "Pane 0: tool calls, messages with attachments, memories and share links created. Pane 1: tool calls per AI reply and the share of user messages with an attachment. Stored human chats only.",
    config: aiFeatureAdoptionConfig,
  },
  {
    slug: "ai-session-depth",
    name: "AI Session Depth",
    description:
      "Pane 0: active threads (got a user message in the bucket) with a 7-day EMA, and new threads. Pane 1: user messages per active thread and active threads per chat user. Stored human chats only. Alerts when fewer than 3 threads are active in a week.",
    config: aiSessionDepthConfig,
  },
];
