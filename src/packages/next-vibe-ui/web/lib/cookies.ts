/**
 * Web implementation of client-side storage using cookies
 * Provides async interface for consistency with native AsyncStorage
 */

import { Environment } from "next-vibe/shared/utils";

import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "@/config/constants";
import { envClient, platform } from "@/config/env-client";

/**
 * Get a cookie value by name (async for platform consistency)
 * @param name - The cookie name
 * @returns Promise resolving to the value or null if not found
 */
export async function getCookie(name: string): Promise<string | null> {
  try {
    if (platform.isServer || typeof document === "undefined") {
      return null;
    }

    const value = `; ${document.cookie}`;
    // eslint-disable-next-line i18next/no-literal-string
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Set a cookie (async for platform consistency)
 * @param name - The cookie name
 * @param value - The value to set
 */
export async function setCookie(name: string, value: string): Promise<void> {
  try {
    if (platform.isServer || typeof document === "undefined") {
      return;
    }

    // Determine if we're on localhost for development
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";

    const options = {
      path: "/",
      domain: isLocalhost ? undefined : window.location.hostname,
      secure: envClient.NODE_ENV === Environment.PRODUCTION && !isLocalhost,
      sameSite: "lax" as const,
    };

    // eslint-disable-next-line i18next/no-literal-string
    let cookieString = `${name}=${encodeURIComponent(value)}`;

    // Handle expires option
    const expiresDate = new Date();
    expiresDate.setTime(
      expiresDate.getTime() + AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS * 1000,
    );
    // eslint-disable-next-line i18next/no-literal-string
    cookieString += `; expires=${expiresDate.toUTCString()}`;

    // eslint-disable-next-line i18next/no-literal-string
    cookieString += `; path=${options.path}`;

    if (options.domain) {
      // eslint-disable-next-line i18next/no-literal-string
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      // eslint-disable-next-line i18next/no-literal-string
      cookieString += `; secure`;
    }
    // eslint-disable-next-line i18next/no-literal-string
    cookieString += `; samesite=${options.sameSite}`;

    document.cookie = cookieString;
  } catch {
    // Silent error handling
  }
}

/**
 * Delete a cookie (async for platform consistency)
 * @param name - The cookie name to delete
 */
export async function deleteCookie(name: string): Promise<void> {
  try {
    if (platform.isServer || typeof document === "undefined") {
      return;
    }

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";

    const options = {
      path: "/",
      domain: isLocalhost ? undefined : window.location.hostname,
      secure: envClient.NODE_ENV === Environment.PRODUCTION && !isLocalhost,
      sameSite: "lax",
    };

    // eslint-disable-next-line i18next/no-literal-string
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${options.path || "/"}`;

    if (options.domain) {
      // eslint-disable-next-line i18next/no-literal-string
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      // eslint-disable-next-line i18next/no-literal-string
      cookieString += `; secure`;
    }

    if (options.sameSite) {
      // eslint-disable-next-line i18next/no-literal-string
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  } catch {
    // Silent error handling
  }
}

/**
 * Get all cookies as an object (async for platform consistency)
 * @returns Promise resolving to an object with cookie names and values
 */
export async function getAllCookies(): Promise<Record<string, string>> {
  try {
    if (platform.isServer || typeof document === "undefined") {
      return {};
    }

    const cookies: Record<string, string> = {};

    if (document.cookie) {
      document.cookie.split(";").forEach((cookie) => {
        // eslint-disable-next-line i18next/no-literal-string
        const [name, value] = cookie.trim().split("=");
        if (name && value) {
          cookies[name] = decodeURIComponent(value);
        }
      });
    }

    return cookies;
  } catch {
    return {};
  }
}
