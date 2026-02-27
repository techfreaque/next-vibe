/**
 * react-reconciler@0.33.0 / React 19.2 compatibility polyfill
 *
 * The production build of react-reconciler@0.33.0 is missing `getOwner()` on
 * its internal dispatchers, but React 19.2+ calls `dispatcher.getOwner()`
 * unconditionally via `ReactSharedInternals.A`.
 *
 * Fix: intercept React's internal dispatcher properties (H and A) and patch
 * each dispatcher object to include a no-op `getOwner` if missing.
 *
 * This file must be imported BEFORE react-reconciler to take effect.
 */

/* eslint-disable i18next/no-literal-string */

import React from "react";

interface DispatcherLike {
  getOwner?: () => null;
  readContext?: (...args: never[]) => void;
}

interface ReactInternals {
  H: DispatcherLike | null;
  A: DispatcherLike | null;
}

// Access React's private internals to patch the dispatcher.
// This is necessary because react-reconciler@0.33.0 doesn't provide getOwner
// in its production build, but React 19.2+ requires it.
const internals = Reflect.get(
  React,
  "__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE",
) as ReactInternals | undefined;

if (internals) {
  // Patch both dispatcher slots (H = hooks dispatcher, A = async dispatcher)
  // React's getOwner() reads from A, hooks read from H
  const slots = ["H", "A"] as const;

  for (const slot of slots) {
    let current = internals[slot];
    if (current && typeof current.getOwner !== "function") {
      current.getOwner = (): null => null;
    }

    Object.defineProperty(internals, slot, {
      get: (): DispatcherLike | null => current,
      set: (value: DispatcherLike | null): void => {
        if (value && typeof value.getOwner !== "function") {
          value.getOwner = (): null => null;
        }
        current = value;
      },
      configurable: true,
    });
  }
}
