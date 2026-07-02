/**
 * Test file for restricted-syntax plugin issues
 * This file intentionally contains code that violates restricted syntax rules
 */

import React from "react";

// ============================================================
// Rule: No 'unknown' type
// Expected error: "Usage of the 'unknown' type isn't allowed..."
// ============================================================
export function processUnknownData(data: unknown): string {
  return String(data);
}

// ============================================================
// Rule: No 'object' type
// Expected error: "Usage of the 'object' type isn't allowed..."
// ============================================================
export function processObjectData(data: object): string {
  return String(data);
}

// ============================================================
// Rule: No 'throw' statements
// Expected error: "Usage of 'throw' statements is not allowed..."
// ============================================================
export function throwError(): never {
  throw new Error("This should trigger a throw statement error");
}

// ============================================================
// Rule: No JSX in object literals (non-allowed properties)
// Expected error: "JSX elements inside object literals are not allowed..."
// ============================================================
export const objectWithJsx = {
  // 'notAllowed' is not in jsxAllowedProperties
  notAllowed: <span>JSX in object literal</span>,
};

// ============================================================
// Valid: JSX in allowed properties (should NOT trigger error)
// These properties are in jsxAllowedProperties config
// ============================================================
export const objectWithAllowedJsx = {
  icon: <span>Icon</span>,
  content: <span>Content</span>,
  title: <span>Title</span>,
  description: <span>Description</span>,
  header: <span>Header</span>,
  footer: <span>Footer</span>,
};

// Component to use in JSX
export function RestrictedSyntaxTestComponent(): React.ReactElement {
  return (
    <div>
      <h1>Restricted Syntax Test</h1>
    </div>
  );
}

// ============================================================================
// TEST 1: unknown type (SHOULD ERROR)
// ============================================================================

const testUnknown: unknown = 5;

// ============================================================================
// TEST 2: object type (SHOULD ERROR)
// ============================================================================

const testObject: object = {};

// ============================================================================
// TEST 3: throw statement (SHOULD ERROR)
// ============================================================================

function testThrow(): void {
  throw new Error("error"); // Should error: Usage of 'throw' statements is not allowed
}

// ============================================================================
// TEST 4: JSX in object literal (SHOULD ERROR)
// ============================================================================

const configWithJsx = {
  content: <div>Test</div>, // Should error: JSX elements inside object literals are not allowed
};

// ============================================================================
// TEST 5: JSX in object with icon exception (SHOULD PASS)
// ============================================================================

const configWithIcon: { icon: React.ReactNode } = {
  icon: <svg>Icon</svg>, // Should NOT error: icon property is allowed
};

// ============================================================================
// TEST 6: Parenthesized JSX in object (SHOULD ERROR)
// ============================================================================

const configWithParenthesizedJsx = {
  element: <span>Wrapped</span>, // Should error: JSX elements inside object literals are not allowed
};

// ============================================================================
// TEST 7: window access (SHOULD ERROR)
// ============================================================================

function testWindow(): string {
  return window.location.href; // Should error: use getCurrentUrl() from next-vibe/ui/web/utils/browser
}

// ============================================================================
// TEST 8: localStorage access (SHOULD ERROR)
// ============================================================================

function testLocalStorage(): string | null {
  return localStorage.getItem("key"); // Should error: use storage from next-vibe/ui/web/lib/storage
}

// ============================================================================
// TEST 9: sessionStorage access (SHOULD ERROR)
// ============================================================================

function testSessionStorage(): string | null {
  return sessionStorage.getItem("key"); // Should error: use storage from next-vibe/ui/web/lib/storage
}

// ============================================================================
// TEST 10: document access (SHOULD ERROR)
// ============================================================================

function testDocument(): string {
  return document.referrer; // Should error: use getReferrer() from next-vibe/ui/web/utils/browser
}

// ============================================================================
// TEST 11: navigator access (SHOULD ERROR)
// ============================================================================

function testNavigator(): string {
  return navigator.userAgent; // Should error: use getUserAgent() from next-vibe/ui/web/utils/browser
}

// ============================================================================
// TEST 12: raw fetch (SHOULD ERROR)
// ============================================================================

async function testRawFetch(): Promise<Response> {
  return await fetch("https://example.com"); // Should error: raw fetch is not allowed
}

// ============================================================================
// TEST 13: window.fetch / globalThis.fetch (SHOULD ERROR)
// ============================================================================

async function testWindowFetch(): Promise<Response> {
  return await globalThis.fetch("https://example.com"); // Should error: raw fetch is not allowed
}

// ============================================================================
// TEST 14: raw fetch with disable comment (SHOULD PASS)
// ============================================================================

async function testAllowedFetch(): Promise<Response> {
  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- external API
  return await fetch("https://example.com");
}

// ============================================================================
// TEST 15: method .fetch() on wrapper objects (SHOULD PASS)
// ============================================================================

interface FetcherLike {
  fetch: (url: string) => Promise<Response>;
}
async function testMethodFetch(apiClient: FetcherLike): Promise<Response> {
  return await apiClient.fetch("https://example.com"); // Should NOT error: method call, not global fetch
}

export {
  configWithIcon,
  configWithJsx,
  configWithParenthesizedJsx,
  testAllowedFetch,
  testDocument,
  testLocalStorage,
  testMethodFetch,
  testNavigator,
  testObject,
  testRawFetch,
  testSessionStorage,
  testThrow,
  testUnknown,
  testWindow,
  testWindowFetch,
};
