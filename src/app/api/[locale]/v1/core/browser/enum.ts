/**
 * Browser API Enums with Translation Options
 * Enum definitions for Chrome DevTools MCP tools with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

/**
 * Chrome DevTools MCP Tool options
 */
export const {
  enum: BrowserTool,
  options: BrowserToolOptions,
  Value: BrowserToolValue,
} = createEnumOptions({
  // Input automation tools (8)
  CLICK: "app.api.v1.core.browser.tool.click",
  DRAG: "app.api.v1.core.browser.tool.drag",
  FILL: "app.api.v1.core.browser.tool.fill",
  FILL_FORM: "app.api.v1.core.browser.tool.fillForm",
  HANDLE_DIALOG: "app.api.v1.core.browser.tool.handleDialog",
  HOVER: "app.api.v1.core.browser.tool.hover",
  PRESS_KEY: "app.api.v1.core.browser.tool.pressKey",
  UPLOAD_FILE: "app.api.v1.core.browser.tool.uploadFile",

  // Navigation automation tools (6)
  CLOSE_PAGE: "app.api.v1.core.browser.tool.closePage",
  LIST_PAGES: "app.api.v1.core.browser.tool.listPages",
  NAVIGATE_PAGE: "app.api.v1.core.browser.tool.navigatePage",
  NEW_PAGE: "app.api.v1.core.browser.tool.newPage",
  SELECT_PAGE: "app.api.v1.core.browser.tool.selectPage",
  WAIT_FOR: "app.api.v1.core.browser.tool.waitFor",

  // Emulation tools (2)
  EMULATE: "app.api.v1.core.browser.tool.emulate",
  RESIZE_PAGE: "app.api.v1.core.browser.tool.resizePage",

  // Performance tools (3)
  PERFORMANCE_ANALYZE_INSIGHT:
    "app.api.v1.core.browser.tool.performanceAnalyzeInsight",
  PERFORMANCE_START_TRACE: "app.api.v1.core.browser.tool.performanceStartTrace",
  PERFORMANCE_STOP_TRACE: "app.api.v1.core.browser.tool.performanceStopTrace",

  // Network tools (2)
  GET_NETWORK_REQUEST: "app.api.v1.core.browser.tool.getNetworkRequest",
  LIST_NETWORK_REQUESTS: "app.api.v1.core.browser.tool.listNetworkRequests",

  // Debugging tools (5)
  EVALUATE_SCRIPT: "app.api.v1.core.browser.tool.evaluateScript",
  GET_CONSOLE_MESSAGE: "app.api.v1.core.browser.tool.getConsoleMessage",
  LIST_CONSOLE_MESSAGES: "app.api.v1.core.browser.tool.listConsoleMessages",
  TAKE_SCREENSHOT: "app.api.v1.core.browser.tool.takeScreenshot",
  TAKE_SNAPSHOT: "app.api.v1.core.browser.tool.takeSnapshot",
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
} = createEnumOptions({
  PENDING: "app.api.v1.core.browser.status.pending",
  RUNNING: "app.api.v1.core.browser.status.running",
  COMPLETED: "app.api.v1.core.browser.status.completed",
  FAILED: "app.api.v1.core.browser.status.failed",
});

// Create DB enum array for Drizzle
export const BrowserToolStatusDB = [
  BrowserToolStatus.PENDING,
  BrowserToolStatus.RUNNING,
  BrowserToolStatus.COMPLETED,
  BrowserToolStatus.FAILED,
] as const;
