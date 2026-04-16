import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from "../../web/ui/pagination";

export type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from "../../web/ui/pagination";

export function Pagination({ children }: PaginationProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Box>{children}</Box>;
  }

  return (
    <Box flexDirection="row" gap={1}>
      {children}
    </Box>
  );
}
Pagination.displayName = "Pagination";

export function PaginationContent({
  children,
}: PaginationContentProps): JSX.Element {
  return (
    <Box flexDirection="row" gap={1}>
      {children}
    </Box>
  );
}
PaginationContent.displayName = "PaginationContent";

export function PaginationItem({ children }: PaginationItemProps): JSX.Element {
  return <Box>{children}</Box>;
}
PaginationItem.displayName = "PaginationItem";

export function PaginationLink({
  children,
  isActive,
}: PaginationLinkProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{children}</Text>;
  }

  if (isActive) {
    return (
      <Text color="cyan" bold>
        [{children}]
      </Text>
    );
  }

  return <Text dimColor>[{children}]</Text>;
}
PaginationLink.displayName = "PaginationLink";

export function PaginationPrevious({
  href,
}: PaginationPreviousProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{"<"}</Text>;
  }

  return (
    <Text dimColor>
      {"<"}
      {href ? ` (${href})` : ""}
    </Text>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

export function PaginationNext({ href }: PaginationNextProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{">"}</Text>;
  }

  return (
    <Text dimColor>
      {">"}
      {href ? ` (${href})` : ""}
    </Text>
  );
}
PaginationNext.displayName = "PaginationNext";

export function PaginationEllipsis({
  className,
}: PaginationEllipsisProps): JSX.Element {
  void className;
  return <Text dimColor>{"..."}</Text>;
}
PaginationEllipsis.displayName = "PaginationEllipsis";
