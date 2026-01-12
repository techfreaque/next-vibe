"use client";

import type { SlotProps } from "input-otp";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "next-vibe/shared/utils/utils";
import { DashIcon } from "next-vibe-ui/ui/icons";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

export type InputOTPProps = {
  containerClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  children: React.ReactNode;
} & StyleType;

export type InputOTPGroupProps = {
  children: React.ReactNode;
} & StyleType;

export type InputOTPSlotProps = {
  index: number;
} & StyleType;

export type InputOTPSeparatorProps = StyleType;

export interface OTPContextValue {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

function InputOTP({
  className,
  style,
  containerClassName,
  maxLength = 6,
  value,
  onChange,
  children,
}: InputOTPProps): React.JSX.Element {
  return (
    <OTPInput
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      style={style}
    >
      {children}
    </OTPInput>
  );
}
InputOTP.displayName = "InputOTP";

function InputOTPGroup({
  className,
  style,
  children,
}: InputOTPGroupProps): React.JSX.Element {
  return (
    <div className={cn("flex items-center", className)} style={style}>
      {children}
    </div>
  );
}
InputOTPGroup.displayName = "InputOTPGroup";

function InputOTPSlot({
  index,
  className,
  style,
}: InputOTPSlotProps): React.JSX.Element | null {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slotProps = inputOTPContext.slots[index];
  if (!slotProps) {
    return null;
  }
  const { char, hasFakeCaret, isActive }: SlotProps = slotProps;

  return (
    <div
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive ? "z-10 ring-1 ring-ring" : "",
        className,
      )}
      style={style}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}
InputOTPSlot.displayName = "InputOTPSlot";

function InputOTPSeparator({
  className,
  style,
}: InputOTPSeparatorProps): React.JSX.Element {
  return (
    <div role="separator" className={className} style={style}>
      <DashIcon />
    </div>
  );
}
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
