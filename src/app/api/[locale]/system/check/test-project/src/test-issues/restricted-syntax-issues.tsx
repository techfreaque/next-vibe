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
