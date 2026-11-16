/**
 * FAQPage JSON-LD. Pure and client-safe, so client pages can build it from the
 * same strings they render. Only for pages that visibly show these Q&As.
 */

import type { JsonLdNode } from "next-vibe/ui/components/json-ld";

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage for a page that already shows these questions and answers. */
export function buildFaqStructuredData(items: readonly FaqItem[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
