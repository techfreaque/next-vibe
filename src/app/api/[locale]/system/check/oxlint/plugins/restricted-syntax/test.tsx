/**
 * Test file for oxlint-plugin-restricted/restricted-syntax rule
 *
 * This file verifies that the restricted-syntax plugin catches all violations:
 * - unknown type usage
 * - object type usage
 * - throw statements
 * - JSX in object literals (except icon property)
 *
 * Each violation is marked with eslint-disable-next-line to assert that an
 * error SHOULD occur. If the rule stops working, these assertions will become
 * errors themselves.
 */

import type React from "react";

// ============================================================================
// TEST 1: unknown type (SHOULD ERROR)
// ============================================================================

// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
const testUnknown: unknown = 5;

// ============================================================================
// TEST 2: object type (SHOULD ERROR)
// ============================================================================

// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
const testObject: object = {};

// ============================================================================
// TEST 3: throw statement (SHOULD ERROR)
// ============================================================================

function testThrow() {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
  throw new Error("error"); // Should error: Usage of 'throw' statements is not allowed
}

// ============================================================================
// TEST 4: JSX in object literal (SHOULD ERROR)
// ============================================================================

const configWithJsx = {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, oxlint-plugin-i18n/no-literal-string
  content: <div>Test</div>, // Should error: JSX elements inside object literals are not allowed
};

// ============================================================================
// TEST 5: JSX in object with icon exception (SHOULD PASS)
// ============================================================================

const configWithIcon: { icon: React.ReactNode } = {
  // eslint-disable-next-line oxlint-plugin-i18n/no-literal-string
  icon: <svg>Icon</svg>, // Should NOT error: icon property is allowed
};

// ============================================================================
// TEST 6: Parenthesized JSX in object (SHOULD ERROR)
// ============================================================================

const configWithParenthesizedJsx = {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, oxlint-plugin-i18n/no-literal-string
  element: <span>Wrapped</span>, // Should error: JSX elements inside object literals are not allowed
};

export {
  testUnknown,
  testObject,
  testThrow,
  configWithJsx,
  configWithIcon,
  configWithParenthesizedJsx,
};
