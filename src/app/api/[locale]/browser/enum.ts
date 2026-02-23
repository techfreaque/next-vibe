/**
 * Browser API Enums with Translation Options
 * Enum definitions for Chrome DevTools MCP tools with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Chrome DevTools MCP Tool options
 */
export const {
  enum: BrowserTool,
  options: BrowserToolOptions,
  Value: BrowserToolValue,
} = createEnumOptions(scopedTranslation, {
  // Input automation tools (8)
  CLICK: "tool.click",
  DRAG: "tool.drag",
  FILL: "tool.fill",
  FILL_FORM: "tool.fillForm",
  HANDLE_DIALOG: "tool.handleDialog",
  HOVER: "tool.hover",
  PRESS_KEY: "tool.pressKey",
  UPLOAD_FILE: "tool.uploadFile",

  // Navigation automation tools (6)
  CLOSE_PAGE: "tool.closePage",
  LIST_PAGES: "tool.listPages",
  NAVIGATE_PAGE: "tool.navigatePage",
  NEW_PAGE: "tool.newPage",
  SELECT_PAGE: "tool.selectPage",
  WAIT_FOR: "tool.waitFor",

  // Emulation tools (2)
  EMULATE: "tool.emulate",
  RESIZE_PAGE: "tool.resizePage",

  // Performance tools (3)
  PERFORMANCE_ANALYZE_INSIGHT: "tool.performanceAnalyzeInsight",
  PERFORMANCE_START_TRACE: "tool.performanceStartTrace",
  PERFORMANCE_STOP_TRACE: "tool.performanceStopTrace",

  // Network tools (2)
  GET_NETWORK_REQUEST: "tool.getNetworkRequest",
  LIST_NETWORK_REQUESTS: "tool.listNetworkRequests",

  // Debugging tools (5)
  EVALUATE_SCRIPT: "tool.evaluateScript",
  GET_CONSOLE_MESSAGE: "tool.getConsoleMessage",
  LIST_CONSOLE_MESSAGES: "tool.listConsoleMessages",
  TAKE_SCREENSHOT: "tool.takeScreenshot",
  TAKE_SNAPSHOT: "tool.takeSnapshot",
});

// Create DB enum array for Drizzle
export const BrowserToolDB = [
  BrowserTool.CLICK,
  BrowserTool.DRAG,
  BrowserTool.FILL,
  BrowserTool.FILL_FORM,
  BrowserTool.HANDLE_DIALOG,
  BrowserTool.HOVER,
  BrowserTool.PRESS_KEY,
  BrowserTool.UPLOAD_FILE,
  BrowserTool.CLOSE_PAGE,
  BrowserTool.LIST_PAGES,
  BrowserTool.NAVIGATE_PAGE,
  BrowserTool.NEW_PAGE,
  BrowserTool.SELECT_PAGE,
  BrowserTool.WAIT_FOR,
  BrowserTool.EMULATE,
  BrowserTool.RESIZE_PAGE,
  BrowserTool.PERFORMANCE_ANALYZE_INSIGHT,
  BrowserTool.PERFORMANCE_START_TRACE,
  BrowserTool.PERFORMANCE_STOP_TRACE,
  BrowserTool.GET_NETWORK_REQUEST,
  BrowserTool.LIST_NETWORK_REQUESTS,
  BrowserTool.EVALUATE_SCRIPT,
  BrowserTool.GET_CONSOLE_MESSAGE,
  BrowserTool.LIST_CONSOLE_MESSAGES,
  BrowserTool.TAKE_SCREENSHOT,
  BrowserTool.TAKE_SNAPSHOT,
] as const;

/**
 * Browser Tool Status options
 */
export const {
  enum: BrowserToolStatus,
  options: BrowserToolStatusOptions,
  Value: BrowserToolStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "status.pending",
  RUNNING: "status.running",
  COMPLETED: "status.completed",
  FAILED: "status.failed",
});

// Create DB enum array for Drizzle
export const BrowserToolStatusDB = [
  BrowserToolStatus.PENDING,
  BrowserToolStatus.RUNNING,
  BrowserToolStatus.COMPLETED,
  BrowserToolStatus.FAILED,
] as const;
