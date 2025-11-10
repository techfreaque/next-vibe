"use client";

import { DashIcon } from "next-vibe-ui/ui/icons";
import type { SlotProps } from "input-otp";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

export interface InputOTPProps {
  className?: string;
  containerClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  children: React.ReactNode;
}

export interface InputOTPGroupProps {
  className?: string;
  children: React.ReactNode;
}

export interface InputOTPSlotProps {
  index: number;
  className?: string;
}

export interface InputOTPSeparatorProps {
  className?: string;
}

export interface OTPContextValue {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

function InputOTP({ className, containerClassName, maxLength = 6, value, onChange, children }: InputOTPProps): React.JSX.Element {
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
    >
      {children}
    </OTPInput>
  );
}
InputOTP.displayName = "InputOTP";

function InputOTPGroup({ className, children }: InputOTPGroupProps): React.JSX.Element {
  return (
    <div className={cn("flex items-center", className)}>
      {children}
    </div>
  );
}
InputOTPGroup.displayName = "InputOTPGroup";

function InputOTPSlot({ index, className }: InputOTPSlotProps): React.JSX.Element | null {
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

function InputOTPSeparator({ className }: InputOTPSeparatorProps): React.JSX.Element {
  return (
    <div role="separator" className={className}>
      <DashIcon />
    </div>
  );
}
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
