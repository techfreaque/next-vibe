/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import { Calendar } from "next-vibe-ui/ui/calendar";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "next-vibe-ui/ui/input-otp";
import { Label } from "next-vibe-ui/ui/label";
import { RadioGroup, RadioGroupItem } from "next-vibe-ui/ui/radio-group";
import { Section } from "next-vibe-ui/ui/section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Slider } from "next-vibe-ui/ui/slider";
import { Switch } from "next-vibe-ui/ui/switch";
import { TagsField } from "next-vibe-ui/ui/tags-field";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { H2 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

export function FormsPreview(): JSX.Element {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tags, setTags] = useState<string[]>(["react", "typescript"]);

  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Form Components</H2>

        <Div className="grid gap-6 md:grid-cols-2">
          <Div className="space-y-2">
            <Label>Input</Label>
            <Input placeholder="Enter text..." />
          </Div>

          <Div className="space-y-2">
            <Label>Textarea</Label>
            <Textarea placeholder="Enter longer text..." />
          </Div>

          <Div className="space-y-2">
            <Label>Select</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </Div>

          <Div className="space-y-2 col-span-2">
            <Label>Tags Field</Label>
            <TagsField value={tags} onChange={setTags} />
          </Div>
        </Div>

        <Div className="mt-6 space-y-4">
          <Div className="space-y-2">
            <Label>Checkbox</Label>
            <Div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </Div>
          </Div>

          <Div className="space-y-2">
            <Label>Radio Group</Label>
            <RadioGroup defaultValue="option1">
              <Div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="r3" />
                <Label htmlFor="r3">Option 3</Label>
              </Div>
            </RadioGroup>
          </Div>

          <Div className="space-y-2">
            <Label>Switch</Label>
            <Div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </Div>
          </Div>

          <Div className="space-y-2">
            <Label>Slider</Label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              className="w-[60%]"
            />
          </Div>

          <Div className="space-y-2">
            <Label>Input OTP</Label>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Div>

          <Div className="space-y-2">
            <Label>Calendar</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
