import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import React from "react";
import type { ScrollView as RNScrollView } from "react-native";
import { Pressable, ScrollView, Text as RNText,View } from "react-native";

import { useTranslation } from "@/i18n/core/client";
import type {
  CarouselApi,
  CarouselButtonProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselProps,
} from "@/packages/next-vibe-ui/web/ui/carousel";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

// Type-safe ScrollView with className support (NativeWind)
const StyledScrollView = styled(ScrollView, { className: "style" });

// Type-safe View with className support (NativeWind)
const StyledView = styled(View, { className: "style" });

// Type-safe Pressable with className support (NativeWind)
const StyledPressable = styled(Pressable, { className: "style" });

// Type-safe Text with className support (NativeWind)
const StyledText = styled(RNText, { className: "style" });

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
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Standard React context hook pattern - throw is correct for developer mistakes
    // eslint-disable-next-line i18next/no-literal-string -- Error handling for context
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

function Carousel({
  className,
  children,
  orientation = "horizontal",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  opts, // Intentionally extracted - not used in React Native
  setApi,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  plugins, // Intentionally extracted - not used in React Native
}: CarouselProps): React.JSX.Element {
  const scrollViewRef = React.useRef<RNScrollView>(null);
  const [canScrollPrev] = React.useState(false);
  const [canScrollNext] = React.useState(true);

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
        className={cn(
          orientation === "horizontal" ? "flex flex-row" : "flex flex-col",
          className,
        )}
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

export { Carousel, CarouselContent,CarouselItem };

function CarouselPrevious({
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  variant = "outline", // Intentionally extracted - not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  size = "icon", // Intentionally extracted - not used in React Native
}: CarouselButtonProps): React.JSX.Element {
  const { scrollPrev, canScrollPrev } = useCarousel();
  const { t } = useTranslation();

  return (
    <StyledPressable
      onPress={scrollPrev}
      disabled={!canScrollPrev}
      className={cn("absolute", className)}
      accessibilityRole="button"
      accessibilityLabel={t(
        "packages.nextVibeUi.web.common.accessibility.srOnly.previousSlide",
      )}
    >
      <StyledText>
        {t("packages.nextVibeUi.web.common.accessibility.srOnly.previousSlide")}
      </StyledText>
    </StyledPressable>
  );
}

function CarouselNext({
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  variant = "outline", // Intentionally extracted - not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  size = "icon", // Intentionally extracted - not used in React Native
}: CarouselButtonProps): React.JSX.Element {
  const { scrollNext, canScrollNext } = useCarousel();
  const { t } = useTranslation();

  return (
    <StyledPressable
      onPress={scrollNext}
      disabled={!canScrollNext}
      className={cn("absolute", className)}
      accessibilityRole="button"
      accessibilityLabel={t(
        "packages.nextVibeUi.web.common.accessibility.srOnly.nextSlide",
      )}
    >
      <StyledText>
        {t("packages.nextVibeUi.web.common.accessibility.srOnly.nextSlide")}
      </StyledText>
    </StyledPressable>
  );
}

export { CarouselNext,CarouselPrevious };
