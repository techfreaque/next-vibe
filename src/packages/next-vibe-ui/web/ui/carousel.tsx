"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "next-vibe-ui/ui/icons";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

import { useTranslation } from "@/i18n/core/client";

import { Button } from "./button";

import type { DivKeyboardEvent } from "./div";

// Cross-platform types for Embla Carousel
export type CarouselApi = ReturnType<typeof useEmblaCarousel>[1];
export type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
export type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];

// Carousel
export type CarouselProps = {
  children?: React.ReactNode;
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
} & StyleType;

// CarouselContent
export type CarouselContentProps = {
  children?: React.ReactNode;
} & StyleType;

// CarouselItem
export type CarouselItemProps = {
  children?: React.ReactNode;
} & StyleType;

interface CarouselContextProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  children?: React.ReactNode;
  className?: string;
  style?: Record<string, string | number>;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel(): CarouselContextProps {
  const context = React.useContext(CarouselContext);

  if (!context) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- Error handling for context
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  style,
  children,
}: CarouselProps): React.JSX.Element {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: DivKeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return (): void => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDown={handleKeyDown}
        className={cn("relative", className)}
        style={style}
        role="region"
        aria-roledescription="carousel"
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  style,
  children,
}: CarouselContentProps): React.JSX.Element {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}

function CarouselItem({
  className,
  style,
  children,
}: CarouselItemProps): React.JSX.Element {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

import type { ButtonProps } from "./button";

export type CarouselButtonProps = Omit<
  ButtonProps,
  | "onClick"
  | "disabled"
  | "onMouseEnter"
  | "onMouseLeave"
  | "tabIndex"
  | "asChild"
  | "children"
>;

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  role,
  style,
  suppressHydrationWarning,
  title,
  type,
}: CarouselButtonProps): React.JSX.Element {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  const { t } = useTranslation();

  return (
    <Button
      variant={variant ?? "outline"}
      size={size ?? "icon"}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      role={role}
      style={style}
      suppressHydrationWarning={suppressHydrationWarning}
      title={title}
      type={type}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
    >
      <>
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="sr-only">
          {t(
            "packages.nextVibeUi.web.common.accessibility.srOnly.previousSlide",
          )}
        </span>
      </>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  role,
  style,
  suppressHydrationWarning,
  title,
  type,
}: CarouselButtonProps): React.JSX.Element {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  const { t } = useTranslation();

  return (
    <Button
      variant={variant ?? "outline"}
      size={size ?? "icon"}
      role={role}
      style={style}
      suppressHydrationWarning={suppressHydrationWarning}
      title={title}
      type={type}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
    >
      <>
        <ArrowRightIcon className="h-4 w-4" />
        <span className="sr-only">
          {t("packages.nextVibeUi.web.common.accessibility.srOnly.nextSlide")}
        </span>
      </>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
};
