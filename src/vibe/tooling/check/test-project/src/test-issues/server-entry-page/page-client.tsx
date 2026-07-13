"use client";

/**
 * Test fixture: EndpointsPage with 'use client' — SHOULD NOT trigger the rule.
 */

import type { JSX } from "react";

import { EndpointsPage } from "../endpoints-page-stub";

export function TestPageClient(): JSX.Element {
  return <EndpointsPage />;
}
