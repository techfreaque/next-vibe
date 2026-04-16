import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
} from "../../web/ui/breadcrumb";

export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps,
} from "../../web/ui/breadcrumb";

export function Breadcrumb({ children }: BreadcrumbProps): JSX.Element {
  return <Box>{children}</Box>;
}
Breadcrumb.displayName = "Breadcrumb";

export function BreadcrumbList({ children }: BreadcrumbListProps): JSX.Element {
  return <Box flexDirection="row">{children}</Box>;
}
BreadcrumbList.displayName = "BreadcrumbList";

export function BreadcrumbItem({ children }: BreadcrumbItemProps): JSX.Element {
  return <Box>{children}</Box>;
}
BreadcrumbItem.displayName = "BreadcrumbItem";

export function BreadcrumbLink({ children }: BreadcrumbLinkProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{children}</Text>;
  }

  return <Text color="cyan">{children}</Text>;
}
BreadcrumbLink.displayName = "BreadcrumbLink";

export function BreadcrumbPage({ children }: BreadcrumbPageProps): JSX.Element {
  return <Text bold>{children}</Text>;
}
BreadcrumbPage.displayName = "BreadcrumbPage";

export function BreadcrumbSeparator({
  children,
}: BreadcrumbSeparatorProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text> {">"} </Text>;
  }

  return <Text dimColor> {children ?? ">"} </Text>;
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export function BreadcrumbEllipsis({
  className,
}: BreadcrumbEllipsisProps): JSX.Element {
  void className;
  return <Text dimColor>{"..."}</Text>;
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
