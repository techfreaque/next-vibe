/**
 * Coarse device / browser / OS parse of a user agent, stored on the lead row
 * when it is created (leads.device_type, browser, os). Lead analytics derive
 * the same values in SQL for rows written before these columns were filled
 * (src/leads/analytics/bot-sql.ts), so keep both rule sets in step.
 */

import { DeviceType } from "./enum";

type DeviceTypeValue = (typeof DeviceType)[keyof typeof DeviceType];

export interface ParsedUserAgent {
  deviceType: DeviceTypeValue;
  /** Product name (proper noun, not translated); null when unrecognized. */
  browser: string | null;
  os: string | null;
}

const BOT_PATTERN =
  /bot\b|bot\/|crawler|spider|slurp|crawling|facebookexternalhit|meta-external|headlesschrome|^curl\/|^wget\/|python-|go-http-client|^bun\//i;

export function parseLeadUserAgent(userAgent: string): ParsedUserAgent {
  const ua = userAgent.toLowerCase();

  let deviceType: DeviceTypeValue = DeviceType.UNKNOWN;
  if (ua.trim().length === 0) {
    deviceType = DeviceType.UNKNOWN;
  } else if (BOT_PATTERN.test(ua)) {
    deviceType = DeviceType.BOT;
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    deviceType = DeviceType.TABLET;
  } else if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    ua.includes("blackberry") ||
    ua.includes("windows phone")
  ) {
    deviceType = DeviceType.MOBILE;
  } else {
    deviceType = DeviceType.DESKTOP;
  }

  let browser: string | null = null;
  if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("edg/")) {
    browser = "Edge";
  } else if (ua.includes("opr/") || ua.includes("opera")) {
    browser = "Opera";
  } else if (ua.includes("chrome") && !ua.includes("chromium")) {
    browser = "Chrome";
  } else if (ua.includes("safari")) {
    browser = "Safari";
  } else if (ua.includes("msie") || ua.includes("trident/")) {
    browser = "Internet Explorer";
  }

  let os: string | null = null;
  if (ua.includes("windows nt")) {
    os = "Windows";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ipod")
  ) {
    os = "iOS";
  } else if (ua.includes("mac os x") || ua.includes("macos")) {
    os = "macOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  } else if (ua.includes("cros")) {
    os = "ChromeOS";
  }

  return { deviceType, browser, os };
}
