"use client";

import { createContext, type JSX, useContext } from "react";

import { Cta } from "../../story/_shared/marketing";

export const ModelPlanChatHref = createContext<string | undefined>(undefined);

export function ModelPlanChatCta({
  href,
  label,
}: {
  href: string;
  label: string;
}): JSX.Element {
  const experimentHref = useContext(ModelPlanChatHref);
  return <Cta href={experimentHref ?? href} label={label} />;
}
