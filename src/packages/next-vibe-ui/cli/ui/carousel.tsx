import * as React from "react";

export type {
  CarouselApi,
  CarouselOptions,
  CarouselPlugin,
  CarouselProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselButtonProps,
} from "../../web/ui/carousel";

import type {
  CarouselProps,
  CarouselContentProps,
  CarouselItemProps,
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
