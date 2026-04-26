import { Box, Text } from "ink";
import type { JSX } from "react";

import type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "../../web/ui/accordion";

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "../../web/ui/accordion";

// CLI: always expanded — no interactivity in terminal

export function Accordion({ children }: AccordionProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}
Accordion.displayName = "Accordion";

export function AccordionItem({ children }: AccordionItemProps): JSX.Element {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {children}
    </Box>
  );
}
AccordionItem.displayName = "AccordionItem";

export function AccordionTrigger({
  children,
}: AccordionTriggerProps): JSX.Element {
  return <Text bold>▼ {children}</Text>;
}
AccordionTrigger.displayName = "AccordionTrigger";

export function AccordionContent({
  children,
}: AccordionContentProps): JSX.Element {
  return <Box paddingLeft={2}>{children}</Box>;
}
AccordionContent.displayName = "AccordionContent";
