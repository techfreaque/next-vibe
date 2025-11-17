import React from "react";
import type { ScrollView as RNScrollView } from "react-native";
import { ScrollView, View, Pressable, Text } from "react-native";
import { styled } from "nativewind";

import type {
  CarouselProps,
  CarouselApi,
  CarouselItemProps,
  CarouselContentProps,
  CarouselButtonProps,
} from "@/packages/next-vibe-ui/web/ui/carousel";
import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
import { useTranslation } from "@/i18n/core/client";

// Type-safe ScrollView with className support (NativeWind)
const StyledScrollView = styled(ScrollView, { className: "style" });

// Type-safe View with className support (NativeWind)
const StyledView = styled(View, { className: "style" });

interface CarouselContextProps {
  scrollViewRef: React.RefObject<RNScrollView | null>;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation?: "horizontal" | "vertical";
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
  className,
  style,
  children,
  orientation = "horizontal",
  opts: _opts,
  setApi,
  plugins: _plugins,
}: CarouselProps): React.JSX.Element {
  const scrollViewRef = React.useRef<RNScrollView>(null);
  const [canScrollPrev, _setCanScrollPrev] = React.useState(false);
  const [canScrollNext, _setCanScrollNext] = React.useState(true);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Expose setApi if provided
  React.useEffect(() => {
    if (setApi && scrollViewRef.current) {
      // Create a simple API object that mimics Embla's interface
      const api: CarouselApi = {
        scrollPrev: () => scrollViewRef.current?.scrollTo({ x: 0 }),
        scrollNext: () => scrollViewRef.current?.scrollToEnd(),
        canScrollPrev: () => canScrollPrev,
        canScrollNext: () => canScrollNext,
      } as CarouselApi;
      setApi(api);
    }
  }, [setApi, canScrollPrev, canScrollNext]);

  const scrollPrev = React.useCallback(() => {
    // Native implementation: scroll left/up
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  }, []);

  const scrollNext = React.useCallback(() => {
    // Native implementation: scroll right/down
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <CarouselContext.Provider
      value={{
        scrollViewRef,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
      }}
    >
      <StyledScrollView
        ref={scrollViewRef}
        horizontal={orientation === "horizontal"}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        {...applyStyleType({
          nativeStyle,
          className: cn(
            orientation === "horizontal" ? "flex flex-row" : "flex flex-col",
            className,
          ),
        })}
      >
        {children}
      </StyledScrollView>
    </CarouselContext.Provider>
  );
}

Carousel.displayName = "Carousel";

function CarouselItem({
  className,
  style,
  children,
}: CarouselItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("shrink-0", className),
      })}
    >
      {children}
    </StyledView>
  );
}

CarouselItem.displayName = "CarouselItem";

// CarouselContent is just an alias for Carousel in native
function CarouselContent(props: CarouselContentProps): React.JSX.Element {
  return <Carousel {...props} />;
}

CarouselContent.displayName = "CarouselContent";

export { Carousel, CarouselItem, CarouselContent };

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  style,
  ...restProps
}: CarouselButtonProps): React.JSX.Element {
  const { scrollPrev, canScrollPrev } = useCarousel();
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Accept props for API compatibility but don't use them in native
  void variant;
  void size;
  void restProps;

  return (
    <Pressable
      onPress={scrollPrev}
      disabled={!canScrollPrev}
      {...applyStyleType({
        nativeStyle,
        className: cn("absolute", className),
      })}
      accessibilityLabel={t(
        "packages.nextVibeUi.web.common.accessibility.srOnly.previousSlide",
      )}
    >
      <Text>
        {t("packages.nextVibeUi.web.common.accessibility.srOnly.previousSlide")}
      </Text>
    </Pressable>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  style,
  ...restProps
}: CarouselButtonProps): React.JSX.Element {
  const { scrollNext, canScrollNext } = useCarousel();
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Accept props for API compatibility but don't use them in native
  void variant;
  void size;
  void restProps;

  return (
    <Pressable
      onPress={scrollNext}
      disabled={!canScrollNext}
      {...applyStyleType({
        nativeStyle,
        className: cn("absolute", className),
      })}
      accessibilityLabel={t(
        "packages.nextVibeUi.web.common.accessibility.srOnly.nextSlide",
      )}
    >
      <Text>
        {t("packages.nextVibeUi.web.common.accessibility.srOnly.nextSlide")}
      </Text>
    </Pressable>
  );
}

export { CarouselPrevious, CarouselNext };
