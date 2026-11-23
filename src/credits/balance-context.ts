"use client";

import { createContext } from "react";

import type { CreditsGetResponseOutput } from "./definition";

export const InitialCreditBalanceContext = createContext<
  CreditsGetResponseOutput | undefined
>(undefined);
