import * as React from "react";

export type {
  CarouselApi,
  CarouselButtonProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselOptions,
  CarouselPlugin,
  CarouselProps,
} from "../../web/ui/carousel";

import type {
  CarouselContentProps,
  CarouselItemProps,
  CarouselProps,
} from "../../web/ui/carousel";

export function Carousel({
  children,
}: CarouselProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function CarouselContent({
  children,
}: CarouselContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function CarouselItem({
  children,
}: CarouselItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function CarouselPrevious(): null {
  return null;
}

export function CarouselNext(): null {
  return null;
}
