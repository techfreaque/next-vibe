/* eslint-disable oxlint-plugin-i18n/no-literal-string */
import * as React from "react";
import { Text, View } from "react-native";

import type { IframeProps } from "@/packages/next-vibe-ui/web/ui/iframe";

/**
 * Platform-agnostic Iframe component for native
 * On native, iframes don't exist - this would require WebView from react-native-webview
 * Currently a placeholder that shows a message
 *
 * TODO: Implement using WebView
 */
export function Iframe({ src }: IframeProps): React.JSX.Element {
  return (
    <View>
      <Text>
        Iframe not supported on native. If you need this feature, implement using WebView from
        react-native-webview.
        {src && ` Source: ${src}`}
      </Text>
    </View>
  );
}
