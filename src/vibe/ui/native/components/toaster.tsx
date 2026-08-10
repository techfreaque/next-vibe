/**
 * Toaster Component for React Native
 * Renders toast notifications from useToast hook
 */
import React from "react";
import { View } from "react-native";

import { useToast } from "../hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

export function Toaster(): React.JSX.Element {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <View className="absolute top-0 left-0 right-0 p-4 z-50 pointer-events-none">
        {toasts.map(({ id, title, description, action, ...props }) => (
          <View key={id} className="mb-2 pointer-events-auto">
            <Toast {...props}>
              <View className="flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </View>
              {action ? <>{action}</> : null}
              <ToastClose />
            </Toast>
          </View>
        ))}
      </View>
      <ToastViewport />
    </ToastProvider>
  );
}
