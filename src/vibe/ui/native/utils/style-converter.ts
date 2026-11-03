/**
 * Centralized utility for converting React web CSSProperties to React Native styles
 * This ensures consistent style conversion across all native components
 */

import { styled } from "nativewind";
import type * as React from "react";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

/**
 * Type-safe wrapper for nativewind's styled() function.
 * Handles the "Type instantiation is excessively deep" error from nativewind v5.
 *
 * @example
 * const StyledView = styledNative(View);
 * const StyledPressable = styledNative(Pressable);
 */
// oxlint-disable-next-line no-explicit-any
export function styledNative<T extends React.ComponentType<any>>(
  Component: T,
): React.ComponentType<React.ComponentProps<T> & { className?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- nativewind styled() produces complex union types that exceed TS depth limits
  return styled(Component as any, {
    className: "style",
  }) as React.ComponentType<React.ComponentProps<T> & { className?: string }>;
}

/**
 * Type-safe wrapper for nativewind's styled() with ref forwarding support.
 * Use this for components that need ref forwarding (ScrollView, TextInput, etc.)
 *
 * @example
 * const StyledScrollView = styledNativeRef(ScrollView);
 */
// oxlint-disable-next-line no-explicit-any
export function styledNativeRef<T extends React.ComponentType<any>, R = any>(
  Component: T,
): React.ForwardRefExoticComponent<
  React.ComponentProps<T> & { className?: string } & React.RefAttributes<R>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- nativewind styled() produces complex union types that exceed TS depth limits
  return styled(Component as any, {
    className: "style",
  }) as React.ForwardRefExoticComponent<
    React.ComponentProps<T> & { className?: string } & React.RefAttributes<R>
  >;
}

/**
 * Convert React.CSSProperties to React Native ViewStyle
 * Only converts properties that exist in both web CSS and React Native ViewStyle
 */
export function convertCSSToViewStyle(
  cssStyle: React.CSSProperties,
): ViewStyle {
  return {
    // Layout
    ...(cssStyle.width !== undefined && {
      width: cssStyle.width as ViewStyle["width"],
    }),
    ...(cssStyle.height !== undefined && {
      height: cssStyle.height as ViewStyle["height"],
    }),
    ...(cssStyle.minWidth !== undefined && {
      minWidth: cssStyle.minWidth as ViewStyle["minWidth"],
    }),
    ...(cssStyle.minHeight !== undefined && {
      minHeight: cssStyle.minHeight as ViewStyle["minHeight"],
    }),
    ...(cssStyle.maxWidth !== undefined && {
      maxWidth: cssStyle.maxWidth as ViewStyle["maxWidth"],
    }),
    ...(cssStyle.maxHeight !== undefined && {
      maxHeight: cssStyle.maxHeight as ViewStyle["maxHeight"],
    }),

    // Spacing
    ...(cssStyle.margin !== undefined && {
      margin: cssStyle.margin as ViewStyle["margin"],
    }),
    ...(cssStyle.marginTop !== undefined && {
      marginTop: cssStyle.marginTop as ViewStyle["marginTop"],
    }),
    ...(cssStyle.marginBottom !== undefined && {
      marginBottom: cssStyle.marginBottom as ViewStyle["marginBottom"],
    }),
    ...(cssStyle.marginLeft !== undefined && {
      marginLeft: cssStyle.marginLeft as ViewStyle["marginLeft"],
    }),
    ...(cssStyle.marginRight !== undefined && {
      marginRight: cssStyle.marginRight as ViewStyle["marginRight"],
    }),
    ...(cssStyle.padding !== undefined && {
      padding: cssStyle.padding as ViewStyle["padding"],
    }),
    ...(cssStyle.paddingTop !== undefined && {
      paddingTop: cssStyle.paddingTop as ViewStyle["paddingTop"],
    }),
    ...(cssStyle.paddingBottom !== undefined && {
      paddingBottom: cssStyle.paddingBottom as ViewStyle["paddingBottom"],
    }),
    ...(cssStyle.paddingLeft !== undefined && {
      paddingLeft: cssStyle.paddingLeft as ViewStyle["paddingLeft"],
    }),
    ...(cssStyle.paddingRight !== undefined && {
      paddingRight: cssStyle.paddingRight as ViewStyle["paddingRight"],
    }),

    // Background & Border
    ...(cssStyle.backgroundColor !== undefined && {
      backgroundColor: cssStyle.backgroundColor as ViewStyle["backgroundColor"],
    }),
    ...(cssStyle.borderRadius !== undefined && {
      borderRadius: cssStyle.borderRadius as ViewStyle["borderRadius"],
    }),
    ...(cssStyle.borderWidth !== undefined && {
      borderWidth: cssStyle.borderWidth as ViewStyle["borderWidth"],
    }),
    ...(cssStyle.borderColor !== undefined && {
      borderColor: cssStyle.borderColor as ViewStyle["borderColor"],
    }),
    ...(cssStyle.borderTopWidth !== undefined && {
      borderTopWidth: cssStyle.borderTopWidth as ViewStyle["borderTopWidth"],
    }),
    ...(cssStyle.borderBottomWidth !== undefined && {
      borderBottomWidth:
        cssStyle.borderBottomWidth as ViewStyle["borderBottomWidth"],
    }),
    ...(cssStyle.borderLeftWidth !== undefined && {
      borderLeftWidth: cssStyle.borderLeftWidth as ViewStyle["borderLeftWidth"],
    }),
    ...(cssStyle.borderRightWidth !== undefined && {
      borderRightWidth:
        cssStyle.borderRightWidth as ViewStyle["borderRightWidth"],
    }),

    // Opacity
    ...(cssStyle.opacity !== undefined && {
      opacity: cssStyle.opacity as ViewStyle["opacity"],
    }),

    // Flexbox
    ...(cssStyle.flex !== undefined && {
      flex: cssStyle.flex as ViewStyle["flex"],
    }),
    ...(cssStyle.flexDirection !== undefined && {
      flexDirection: cssStyle.flexDirection as ViewStyle["flexDirection"],
    }),
    ...(cssStyle.flexWrap !== undefined && {
      flexWrap: cssStyle.flexWrap as ViewStyle["flexWrap"],
    }),
    ...(cssStyle.alignItems !== undefined && {
      alignItems: cssStyle.alignItems as ViewStyle["alignItems"],
    }),
    ...(cssStyle.alignSelf !== undefined && {
      alignSelf: cssStyle.alignSelf as ViewStyle["alignSelf"],
    }),
    ...(cssStyle.alignContent !== undefined && {
      alignContent: cssStyle.alignContent as ViewStyle["alignContent"],
    }),
    ...(cssStyle.justifyContent !== undefined && {
      justifyContent: cssStyle.justifyContent as ViewStyle["justifyContent"],
    }),
    ...(cssStyle.flexGrow !== undefined && {
      flexGrow: cssStyle.flexGrow as ViewStyle["flexGrow"],
    }),
    ...(cssStyle.flexShrink !== undefined && {
      flexShrink: cssStyle.flexShrink as ViewStyle["flexShrink"],
    }),
    ...(cssStyle.flexBasis !== undefined && {
      flexBasis: cssStyle.flexBasis as ViewStyle["flexBasis"],
    }),

    // Positioning
    ...(cssStyle.position !== undefined && {
      position: cssStyle.position as ViewStyle["position"],
    }),
    ...(cssStyle.top !== undefined && {
      top: cssStyle.top as ViewStyle["top"],
    }),
    ...(cssStyle.bottom !== undefined && {
      bottom: cssStyle.bottom as ViewStyle["bottom"],
    }),
    ...(cssStyle.left !== undefined && {
      left: cssStyle.left as ViewStyle["left"],
    }),
    ...(cssStyle.right !== undefined && {
      right: cssStyle.right as ViewStyle["right"],
    }),
    ...(cssStyle.zIndex !== undefined && {
      zIndex: cssStyle.zIndex as ViewStyle["zIndex"],
    }),

    // Overflow & Display
    ...(cssStyle.overflow !== undefined && {
      overflow: cssStyle.overflow as ViewStyle["overflow"],
    }),
    ...(cssStyle.display !== undefined && {
      display: cssStyle.display as ViewStyle["display"],
    }),
  };
}

/**
 * Convert React.CSSProperties to React Native TextStyle
 * Only converts properties that exist in both web CSS and React Native TextStyle
 */
export function convertCSSToTextStyle(
  cssStyle: React.CSSProperties,
): TextStyle {
  return {
    // Typography
    ...(cssStyle.color !== undefined && {
      color: cssStyle.color as TextStyle["color"],
    }),
    ...(cssStyle.fontSize !== undefined && {
      fontSize: cssStyle.fontSize as TextStyle["fontSize"],
    }),
    ...(cssStyle.fontWeight !== undefined && {
      fontWeight: cssStyle.fontWeight as TextStyle["fontWeight"],
    }),
    ...(cssStyle.fontStyle !== undefined && {
      fontStyle: cssStyle.fontStyle as TextStyle["fontStyle"],
    }),
    ...(cssStyle.fontFamily !== undefined && {
      fontFamily: cssStyle.fontFamily as TextStyle["fontFamily"],
    }),
    ...(cssStyle.lineHeight !== undefined && {
      lineHeight: cssStyle.lineHeight as TextStyle["lineHeight"],
    }),
    ...(cssStyle.textAlign !== undefined && {
      textAlign: cssStyle.textAlign as TextStyle["textAlign"],
    }),
    ...(cssStyle.textDecorationLine !== undefined && {
      textDecorationLine:
        cssStyle.textDecorationLine as TextStyle["textDecorationLine"],
    }),
    ...(cssStyle.textDecorationStyle !== undefined && {
      textDecorationStyle:
        cssStyle.textDecorationStyle as TextStyle["textDecorationStyle"],
    }),
    ...(cssStyle.textDecorationColor !== undefined && {
      textDecorationColor:
        cssStyle.textDecorationColor as TextStyle["textDecorationColor"],
    }),
    ...(cssStyle.textTransform !== undefined && {
      textTransform: cssStyle.textTransform as TextStyle["textTransform"],
    }),
    ...(cssStyle.letterSpacing !== undefined && {
      letterSpacing: cssStyle.letterSpacing as TextStyle["letterSpacing"],
    }),

    // Opacity
    ...(cssStyle.opacity !== undefined && {
      opacity: cssStyle.opacity as TextStyle["opacity"],
    }),

    // Spacing (TextStyle also supports these)
    ...(cssStyle.margin !== undefined && {
      margin: cssStyle.margin as TextStyle["margin"],
    }),
    ...(cssStyle.marginTop !== undefined && {
      marginTop: cssStyle.marginTop as TextStyle["marginTop"],
    }),
    ...(cssStyle.marginBottom !== undefined && {
      marginBottom: cssStyle.marginBottom as TextStyle["marginBottom"],
    }),
    ...(cssStyle.marginLeft !== undefined && {
      marginLeft: cssStyle.marginLeft as TextStyle["marginLeft"],
    }),
    ...(cssStyle.marginRight !== undefined && {
      marginRight: cssStyle.marginRight as TextStyle["marginRight"],
    }),
    ...(cssStyle.padding !== undefined && {
      padding: cssStyle.padding as TextStyle["padding"],
    }),
    ...(cssStyle.paddingTop !== undefined && {
      paddingTop: cssStyle.paddingTop as TextStyle["paddingTop"],
    }),
    ...(cssStyle.paddingBottom !== undefined && {
      paddingBottom: cssStyle.paddingBottom as TextStyle["paddingBottom"],
    }),
    ...(cssStyle.paddingLeft !== undefined && {
      paddingLeft: cssStyle.paddingLeft as TextStyle["paddingLeft"],
    }),
    ...(cssStyle.paddingRight !== undefined && {
      paddingRight: cssStyle.paddingRight as TextStyle["paddingRight"],
    }),
  };
}

/**
 * Convert React.CSSProperties to React Native ImageStyle
 * Only converts properties that exist in both web CSS and React Native ImageStyle
 */
export function convertCSSToImageStyle(
  cssStyle: React.CSSProperties,
): ImageStyle {
  return {
    // Layout
    ...(cssStyle.width !== undefined && {
      width: cssStyle.width as ImageStyle["width"],
    }),
    ...(cssStyle.height !== undefined && {
      height: cssStyle.height as ImageStyle["height"],
    }),

    // Opacity
    ...(cssStyle.opacity !== undefined && {
      opacity: cssStyle.opacity as ImageStyle["opacity"],
    }),

    // Border
    ...(cssStyle.borderRadius !== undefined && {
      borderRadius: cssStyle.borderRadius as ImageStyle["borderRadius"],
    }),
    ...(cssStyle.borderWidth !== undefined && {
      borderWidth: cssStyle.borderWidth as ImageStyle["borderWidth"],
    }),
    ...(cssStyle.borderColor !== undefined && {
      borderColor: cssStyle.borderColor as ImageStyle["borderColor"],
    }),
    ...(cssStyle.borderTopWidth !== undefined && {
      borderTopWidth: cssStyle.borderTopWidth as ImageStyle["borderTopWidth"],
    }),
    ...(cssStyle.borderBottomWidth !== undefined && {
      borderBottomWidth:
        cssStyle.borderBottomWidth as ImageStyle["borderBottomWidth"],
    }),
    ...(cssStyle.borderLeftWidth !== undefined && {
      borderLeftWidth:
        cssStyle.borderLeftWidth as ImageStyle["borderLeftWidth"],
    }),
    ...(cssStyle.borderRightWidth !== undefined && {
      borderRightWidth:
        cssStyle.borderRightWidth as ImageStyle["borderRightWidth"],
    }),

    // Background color
    ...(cssStyle.backgroundColor !== undefined && {
      backgroundColor:
        cssStyle.backgroundColor as ImageStyle["backgroundColor"],
    }),

    // Overflow
    ...(cssStyle.overflow !== undefined && {
      overflow: cssStyle.overflow as ImageStyle["overflow"],
    }),

    // Positioning (ImageStyle also supports these)
    ...(cssStyle.position !== undefined && {
      position: cssStyle.position as ImageStyle["position"],
    }),
    ...(cssStyle.top !== undefined && {
      top: cssStyle.top as ImageStyle["top"],
    }),
    ...(cssStyle.bottom !== undefined && {
      bottom: cssStyle.bottom as ImageStyle["bottom"],
    }),
    ...(cssStyle.left !== undefined && {
      left: cssStyle.left as ImageStyle["left"],
    }),
    ...(cssStyle.right !== undefined && {
      right: cssStyle.right as ImageStyle["right"],
    }),

    // Margin
    ...(cssStyle.margin !== undefined && {
      margin: cssStyle.margin as ImageStyle["margin"],
    }),
    ...(cssStyle.marginTop !== undefined && {
      marginTop: cssStyle.marginTop as ImageStyle["marginTop"],
    }),
    ...(cssStyle.marginBottom !== undefined && {
      marginBottom: cssStyle.marginBottom as ImageStyle["marginBottom"],
    }),
    ...(cssStyle.marginLeft !== undefined && {
      marginLeft: cssStyle.marginLeft as ImageStyle["marginLeft"],
    }),
    ...(cssStyle.marginRight !== undefined && {
      marginRight: cssStyle.marginRight as ImageStyle["marginRight"],
    }),
  };
}
