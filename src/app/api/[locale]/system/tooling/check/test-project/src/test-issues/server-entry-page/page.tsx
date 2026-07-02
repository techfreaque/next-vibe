/**
 * Test fixture: EndpointsPage in a server entry file (page.tsx without 'use client').
 * Expected error: endpointsPageInServerEntry [oxlint-plugin-restricted(restricted-syntax)]
 */

// ============================================================================
// TEST 1: EndpointsPage imported as a value in a server entry — SHOULD ERROR
// ============================================================================

import type { JSX } from "react";

import { EndpointsPage } from "../endpoints-page-stub";

export default function TestServerEntryPage(): JSX.Element {
  return <EndpointsPage />;
}

// ============================================================================
// TEST 2: type-only import of EndpointsPage — SHOULD PASS (no value import)
// ============================================================================

import type { EndpointsPage as EndpointsPageType } from "../endpoints-page-stub";

export type { EndpointsPageType };
