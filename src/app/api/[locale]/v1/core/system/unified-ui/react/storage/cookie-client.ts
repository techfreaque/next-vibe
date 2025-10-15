/**
 * Client-side cookie utilities for browser environments
 * These functions provide a simple interface for cookie management
 * specifically for authentication tokens and session data.
 */

import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "next-vibe/shared/constants";
import { Environment } from "next-vibe/shared/utils";

import { envClient } from "@/config/env-client";

/**
 * Get a cookie value by name (client-side only)
 * @param name - The name of the cookie
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  try {
    if (envClient.platform.isServer || typeof document === "undefined") {
      // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
      throw new Error("getCookie cannot be called on the server");
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
    // Silent error handling - logging should be handled by calling context
    return null;
  }
}

/**
 * Set a cookie (client-side only)
 * @param name - The name of the cookie
 * @param value - The value to set
 * @param options - Cookie options
 */
export function setCookie(name: string, value: string): void {
  try {
    if (envClient.platform.isServer || typeof document === "undefined") {
      // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
      throw new Error("setCookie cannot be called on the server");
    }

    // Determine if we're on localhost for development
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";

    const options = {
      path: "/",
      // Only set domain for non-localhost environments to avoid issues in development
      domain: isLocalhost ? undefined : window.location.hostname,
      // Only use secure cookies in production or over HTTPS
      secure: envClient.NODE_ENV === Environment.PRODUCTION && !isLocalhost,
      sameSite: "lax" as const, // to allow cross-site redirects (e.g., from Stripe)
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

    // Add other options only if they have valid values
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
    // Silent error handling - logging should be handled by calling context
  }
}

/**
 * Delete a cookie (client-side only)
 * @param name - The name of the cookie to delete
 * @param options - Cookie options (path and domain should match the original cookie)
 */
export function deleteCookie(name: string): void {
  try {
    if (envClient.platform.isServer || typeof document === "undefined") {
      // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
      throw new Error("deleteCookie cannot be called on the server");
    }

    // Determine if we're on localhost for development
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";

    const options = {
      path: "/",
      // Only set domain for non-localhost environments to avoid issues in development
      domain: isLocalhost ? undefined : window.location.hostname,
      // Only use secure cookies in production or over HTTPS
      secure: envClient.NODE_ENV === Environment.PRODUCTION && !isLocalhost,
      sameSite: "lax", // to allow cross-site redirects (e.g., from Stripe)
    };
    // eslint-disable-next-line i18next/no-literal-string
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${options.path || "/"}`;

    // Add domain if specified
    if (options.domain) {
      // eslint-disable-next-line i18next/no-literal-string
      cookieString += `; domain=${options.domain}`;
    }

    // Add secure flag if needed
    if (options.secure) {
      // eslint-disable-next-line i18next/no-literal-string
      cookieString += `; secure`;
    }

    // Add sameSite
    if (options.sameSite) {
      // eslint-disable-next-line i18next/no-literal-string
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  } catch {
    // Silent error handling - logging should be handled by calling context
  }
}

/**
 * Get all cookies as an object (client-side only)
 * @returns An object with cookie names as keys and values as values
 */
export function getAllCookies(): Record<string, string> {
  try {
    if (envClient.platform.isServer || typeof document === "undefined") {
      // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
      throw new Error("getAllCookies cannot be called on the server");
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
    // Silent error handling - logging should be handled by calling context
    return {};
  }
}
