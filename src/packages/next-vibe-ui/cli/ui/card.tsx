import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "../../web/ui/card";

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "../../web/ui/card";

export function Card({ children }: CardProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Box flexDirection="column">{children}</Box>;
  }

  return (
    <Box flexDirection="column" borderStyle="single" borderColor="gray">
      {children}
    </Box>
  );
}
Card.displayName = "Card";

export function CardHeader({ children }: CardHeaderProps): JSX.Element {
  return (
    <Box flexDirection="column" paddingBottom={1}>
      {children}
    </Box>
  );
}
CardHeader.displayName = "CardHeader";

export function CardTitle({ children }: CardTitleProps): JSX.Element {
  return <Text bold>{children}</Text>;
}
CardTitle.displayName = "CardTitle";

export function CardDescription({
  children,
}: CardDescriptionProps): JSX.Element {
  return <Text dimColor>{children}</Text>;
}
CardDescription.displayName = "CardDescription";

export function CardContent({ children }: CardContentProps): JSX.Element {
  return <Box paddingLeft={1}>{children}</Box>;
}
CardContent.displayName = "CardContent";

export function CardFooter({ children }: CardFooterProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Box>{children}</Box>;
  }

  return (
    <Box paddingTop={1}>
      <Text dimColor>{children}</Text>
    </Box>
  );
}
CardFooter.displayName = "CardFooter";
