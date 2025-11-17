/**
 * Centralized utility for converting React web CSSProperties to React Native styles
 * This ensures consistent style conversion across all native components
 */

import type { ViewStyle, TextStyle, ImageStyle } from "react-native";

/**
 * Convert React.CSSProperties to React Native ViewStyle
 * Only converts properties that exist in both web CSS and React Native ViewStyle
 */
export function convertCSSToViewStyle(
  cssStyle: React.CSSProperties,
): ViewStyle {
  const viewStyle: ViewStyle = {};

  // Layout
  if (cssStyle.width !== undefined) {
    viewStyle.width = cssStyle.width as ViewStyle["width"];
  }
  if (cssStyle.height !== undefined) {
    viewStyle.height = cssStyle.height as ViewStyle["height"];
  }
  if (cssStyle.minWidth !== undefined) {
    viewStyle.minWidth = cssStyle.minWidth as ViewStyle["minWidth"];
  }
  if (cssStyle.minHeight !== undefined) {
    viewStyle.minHeight = cssStyle.minHeight as ViewStyle["minHeight"];
  }
  if (cssStyle.maxWidth !== undefined) {
    viewStyle.maxWidth = cssStyle.maxWidth as ViewStyle["maxWidth"];
  }
  if (cssStyle.maxHeight !== undefined) {
    viewStyle.maxHeight = cssStyle.maxHeight as ViewStyle["maxHeight"];
  }

  // Spacing
  if (cssStyle.margin !== undefined) {
    viewStyle.margin = cssStyle.margin as ViewStyle["margin"];
  }
  if (cssStyle.marginTop !== undefined) {
    viewStyle.marginTop = cssStyle.marginTop as ViewStyle["marginTop"];
  }
  if (cssStyle.marginBottom !== undefined) {
    viewStyle.marginBottom = cssStyle.marginBottom as ViewStyle["marginBottom"];
  }
  if (cssStyle.marginLeft !== undefined) {
    viewStyle.marginLeft = cssStyle.marginLeft as ViewStyle["marginLeft"];
  }
  if (cssStyle.marginRight !== undefined) {
    viewStyle.marginRight = cssStyle.marginRight as ViewStyle["marginRight"];
  }
  if (cssStyle.padding !== undefined) {
    viewStyle.padding = cssStyle.padding as ViewStyle["padding"];
  }
  if (cssStyle.paddingTop !== undefined) {
    viewStyle.paddingTop = cssStyle.paddingTop as ViewStyle["paddingTop"];
  }
  if (cssStyle.paddingBottom !== undefined) {
    viewStyle.paddingBottom =
      cssStyle.paddingBottom as ViewStyle["paddingBottom"];
  }
  if (cssStyle.paddingLeft !== undefined) {
    viewStyle.paddingLeft = cssStyle.paddingLeft as ViewStyle["paddingLeft"];
  }
  if (cssStyle.paddingRight !== undefined) {
    viewStyle.paddingRight = cssStyle.paddingRight as ViewStyle["paddingRight"];
  }

  // Background & Border
  if (cssStyle.backgroundColor !== undefined) {
    viewStyle.backgroundColor =
      cssStyle.backgroundColor as ViewStyle["backgroundColor"];
  }
  if (cssStyle.borderRadius !== undefined) {
    viewStyle.borderRadius = cssStyle.borderRadius as ViewStyle["borderRadius"];
  }
  if (cssStyle.borderWidth !== undefined) {
    viewStyle.borderWidth = cssStyle.borderWidth as ViewStyle["borderWidth"];
  }
  if (cssStyle.borderColor !== undefined) {
    viewStyle.borderColor = cssStyle.borderColor as ViewStyle["borderColor"];
  }
  if (cssStyle.borderTopWidth !== undefined) {
    viewStyle.borderTopWidth =
      cssStyle.borderTopWidth as ViewStyle["borderTopWidth"];
  }
  if (cssStyle.borderBottomWidth !== undefined) {
    viewStyle.borderBottomWidth =
      cssStyle.borderBottomWidth as ViewStyle["borderBottomWidth"];
  }
  if (cssStyle.borderLeftWidth !== undefined) {
    viewStyle.borderLeftWidth =
      cssStyle.borderLeftWidth as ViewStyle["borderLeftWidth"];
  }
  if (cssStyle.borderRightWidth !== undefined) {
    viewStyle.borderRightWidth =
      cssStyle.borderRightWidth as ViewStyle["borderRightWidth"];
  }

  // Opacity
  if (cssStyle.opacity !== undefined) {
    viewStyle.opacity = cssStyle.opacity as ViewStyle["opacity"];
  }

  // Flexbox
  if (cssStyle.flex !== undefined) {
    viewStyle.flex = cssStyle.flex as ViewStyle["flex"];
  }
  if (cssStyle.flexDirection !== undefined) {
    viewStyle.flexDirection =
      cssStyle.flexDirection as ViewStyle["flexDirection"];
  }
  if (cssStyle.flexWrap !== undefined) {
    viewStyle.flexWrap = cssStyle.flexWrap as ViewStyle["flexWrap"];
  }
  if (cssStyle.alignItems !== undefined) {
    viewStyle.alignItems = cssStyle.alignItems as ViewStyle["alignItems"];
  }
  if (cssStyle.alignSelf !== undefined) {
    viewStyle.alignSelf = cssStyle.alignSelf as ViewStyle["alignSelf"];
  }
  if (cssStyle.alignContent !== undefined) {
    viewStyle.alignContent = cssStyle.alignContent as ViewStyle["alignContent"];
  }
  if (cssStyle.justifyContent !== undefined) {
    viewStyle.justifyContent =
      cssStyle.justifyContent as ViewStyle["justifyContent"];
  }
  if (cssStyle.flexGrow !== undefined) {
    viewStyle.flexGrow = cssStyle.flexGrow as ViewStyle["flexGrow"];
  }
  if (cssStyle.flexShrink !== undefined) {
    viewStyle.flexShrink = cssStyle.flexShrink as ViewStyle["flexShrink"];
  }
  if (cssStyle.flexBasis !== undefined) {
    viewStyle.flexBasis = cssStyle.flexBasis as ViewStyle["flexBasis"];
  }

  // Positioning
  if (cssStyle.position !== undefined) {
    viewStyle.position = cssStyle.position as ViewStyle["position"];
  }
  if (cssStyle.top !== undefined) {
    viewStyle.top = cssStyle.top as ViewStyle["top"];
  }
  if (cssStyle.bottom !== undefined) {
    viewStyle.bottom = cssStyle.bottom as ViewStyle["bottom"];
  }
  if (cssStyle.left !== undefined) {
    viewStyle.left = cssStyle.left as ViewStyle["left"];
  }
  if (cssStyle.right !== undefined) {
    viewStyle.right = cssStyle.right as ViewStyle["right"];
  }
  if (cssStyle.zIndex !== undefined) {
    viewStyle.zIndex = cssStyle.zIndex as ViewStyle["zIndex"];
  }

  // Overflow & Display
  if (cssStyle.overflow !== undefined) {
    viewStyle.overflow = cssStyle.overflow as ViewStyle["overflow"];
  }
  if (cssStyle.display !== undefined) {
    viewStyle.display = cssStyle.display as ViewStyle["display"];
  }

  return viewStyle;
}

/**
 * Convert React.CSSProperties to React Native TextStyle
 * Only converts properties that exist in both web CSS and React Native TextStyle
 */
export function convertCSSToTextStyle(
  cssStyle: React.CSSProperties,
): TextStyle {
  const textStyle: TextStyle = {};

  // Typography
  if (cssStyle.color !== undefined) {
    textStyle.color = cssStyle.color as TextStyle["color"];
  }
  if (cssStyle.fontSize !== undefined) {
    textStyle.fontSize = cssStyle.fontSize as TextStyle["fontSize"];
  }
  if (cssStyle.fontWeight !== undefined) {
    textStyle.fontWeight = cssStyle.fontWeight as TextStyle["fontWeight"];
  }
  if (cssStyle.fontStyle !== undefined) {
    textStyle.fontStyle = cssStyle.fontStyle as TextStyle["fontStyle"];
  }
  if (cssStyle.fontFamily !== undefined) {
    textStyle.fontFamily = cssStyle.fontFamily as TextStyle["fontFamily"];
  }
  if (cssStyle.lineHeight !== undefined) {
    textStyle.lineHeight = cssStyle.lineHeight as TextStyle["lineHeight"];
  }
  if (cssStyle.textAlign !== undefined) {
    textStyle.textAlign = cssStyle.textAlign as TextStyle["textAlign"];
  }
  if (cssStyle.textDecorationLine !== undefined) {
    textStyle.textDecorationLine =
      cssStyle.textDecorationLine as TextStyle["textDecorationLine"];
  }
  if (cssStyle.textDecorationStyle !== undefined) {
    textStyle.textDecorationStyle =
      cssStyle.textDecorationStyle as TextStyle["textDecorationStyle"];
  }
  if (cssStyle.textDecorationColor !== undefined) {
    textStyle.textDecorationColor =
      cssStyle.textDecorationColor as TextStyle["textDecorationColor"];
  }
  if (cssStyle.textTransform !== undefined) {
    textStyle.textTransform =
      cssStyle.textTransform as TextStyle["textTransform"];
  }
  if (cssStyle.letterSpacing !== undefined) {
    textStyle.letterSpacing =
      cssStyle.letterSpacing as TextStyle["letterSpacing"];
  }

  // Opacity
  if (cssStyle.opacity !== undefined) {
    textStyle.opacity = cssStyle.opacity as TextStyle["opacity"];
  }

  // Spacing (TextStyle also supports these)
  if (cssStyle.margin !== undefined) {
    textStyle.margin = cssStyle.margin as TextStyle["margin"];
  }
  if (cssStyle.marginTop !== undefined) {
    textStyle.marginTop = cssStyle.marginTop as TextStyle["marginTop"];
  }
  if (cssStyle.marginBottom !== undefined) {
    textStyle.marginBottom = cssStyle.marginBottom as TextStyle["marginBottom"];
  }
  if (cssStyle.marginLeft !== undefined) {
    textStyle.marginLeft = cssStyle.marginLeft as TextStyle["marginLeft"];
  }
  if (cssStyle.marginRight !== undefined) {
    textStyle.marginRight = cssStyle.marginRight as TextStyle["marginRight"];
  }
  if (cssStyle.padding !== undefined) {
    textStyle.padding = cssStyle.padding as TextStyle["padding"];
  }
  if (cssStyle.paddingTop !== undefined) {
    textStyle.paddingTop = cssStyle.paddingTop as TextStyle["paddingTop"];
  }
  if (cssStyle.paddingBottom !== undefined) {
    textStyle.paddingBottom =
      cssStyle.paddingBottom as TextStyle["paddingBottom"];
  }
  if (cssStyle.paddingLeft !== undefined) {
    textStyle.paddingLeft = cssStyle.paddingLeft as TextStyle["paddingLeft"];
  }
  if (cssStyle.paddingRight !== undefined) {
    textStyle.paddingRight = cssStyle.paddingRight as TextStyle["paddingRight"];
  }

  return textStyle;
}

/**
 * Convert React.CSSProperties to React Native ImageStyle
 * Only converts properties that exist in both web CSS and React Native ImageStyle
 */
export function convertCSSToImageStyle(
  cssStyle: React.CSSProperties,
): ImageStyle {
  const imageStyle: ImageStyle = {};

  // Layout
  if (cssStyle.width !== undefined) {
    imageStyle.width = cssStyle.width as ImageStyle["width"];
  }
  if (cssStyle.height !== undefined) {
    imageStyle.height = cssStyle.height as ImageStyle["height"];
  }

  // Opacity
  if (cssStyle.opacity !== undefined) {
    imageStyle.opacity = cssStyle.opacity as ImageStyle["opacity"];
  }

  // Border
  if (cssStyle.borderRadius !== undefined) {
    imageStyle.borderRadius =
      cssStyle.borderRadius as ImageStyle["borderRadius"];
  }
  if (cssStyle.borderWidth !== undefined) {
    imageStyle.borderWidth = cssStyle.borderWidth as ImageStyle["borderWidth"];
  }
  if (cssStyle.borderColor !== undefined) {
    imageStyle.borderColor = cssStyle.borderColor as ImageStyle["borderColor"];
  }
  if (cssStyle.borderTopWidth !== undefined) {
    imageStyle.borderTopWidth =
      cssStyle.borderTopWidth as ImageStyle["borderTopWidth"];
  }
  if (cssStyle.borderBottomWidth !== undefined) {
    imageStyle.borderBottomWidth =
      cssStyle.borderBottomWidth as ImageStyle["borderBottomWidth"];
  }
  if (cssStyle.borderLeftWidth !== undefined) {
    imageStyle.borderLeftWidth =
      cssStyle.borderLeftWidth as ImageStyle["borderLeftWidth"];
  }
  if (cssStyle.borderRightWidth !== undefined) {
    imageStyle.borderRightWidth =
      cssStyle.borderRightWidth as ImageStyle["borderRightWidth"];
  }

  // Background color
  if (cssStyle.backgroundColor !== undefined) {
    imageStyle.backgroundColor =
      cssStyle.backgroundColor as ImageStyle["backgroundColor"];
  }

  // Overflow
  if (cssStyle.overflow !== undefined) {
    imageStyle.overflow = cssStyle.overflow as ImageStyle["overflow"];
  }

  // Positioning (ImageStyle also supports these)
  if (cssStyle.position !== undefined) {
    imageStyle.position = cssStyle.position as ImageStyle["position"];
  }
  if (cssStyle.top !== undefined) {
    imageStyle.top = cssStyle.top as ImageStyle["top"];
  }
  if (cssStyle.bottom !== undefined) {
    imageStyle.bottom = cssStyle.bottom as ImageStyle["bottom"];
  }
  if (cssStyle.left !== undefined) {
    imageStyle.left = cssStyle.left as ImageStyle["left"];
  }
  if (cssStyle.right !== undefined) {
    imageStyle.right = cssStyle.right as ImageStyle["right"];
  }

  // Margin
  if (cssStyle.margin !== undefined) {
    imageStyle.margin = cssStyle.margin as ImageStyle["margin"];
  }
  if (cssStyle.marginTop !== undefined) {
    imageStyle.marginTop = cssStyle.marginTop as ImageStyle["marginTop"];
  }
  if (cssStyle.marginBottom !== undefined) {
    imageStyle.marginBottom =
      cssStyle.marginBottom as ImageStyle["marginBottom"];
  }
  if (cssStyle.marginLeft !== undefined) {
    imageStyle.marginLeft = cssStyle.marginLeft as ImageStyle["marginLeft"];
  }
  if (cssStyle.marginRight !== undefined) {
    imageStyle.marginRight = cssStyle.marginRight as ImageStyle["marginRight"];
  }

  return imageStyle;
}
