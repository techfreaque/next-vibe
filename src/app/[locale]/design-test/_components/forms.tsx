/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import { Calendar } from "next-vibe-ui/ui/calendar";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { DatePicker } from "next-vibe-ui/ui/date-picker";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "next-vibe-ui/ui/input-otp";
import { Label } from "next-vibe-ui/ui/label";
import { MultiSelect } from "next-vibe-ui/ui/multi-select";
import { NumberInput } from "next-vibe-ui/ui/number-input";
import { PhoneField } from "next-vibe-ui/ui/phone-field";
import { RadioGroup, RadioGroupItem } from "next-vibe-ui/ui/radio-group";
import { Section } from "next-vibe-ui/ui/section";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Slider } from "next-vibe-ui/ui/slider";
import { Switch } from "next-vibe-ui/ui/switch";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { H2, H3, Muted, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

export function FormsPreview(): JSX.Element {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [pickerDate, setPickerDate] = useState<Date | undefined>(new Date());
  const [multiValue, setMultiValue] = useState<string[]>(["react"]);
  const [phoneValue, setPhoneValue] = useState("");
  const [numberValue, setNumberValue] = useState(42);
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Form Components</H2>

        {/* Input variants */}
        <Div className="space-y-6">
          <Div className="space-y-2">
            <H3>Input</H3>
            <Div className="grid gap-4 md:grid-cols-2">
              <Div className="space-y-2">
                <Label>Default</Label>
                <Input placeholder="Enter text..." />
              </Div>
              <Div className="space-y-2">
                <Label>With value</Label>
                <Input defaultValue="Hello world" />
              </Div>
              <Div className="space-y-2">
                <Label>Disabled</Label>
                <Input placeholder="Disabled input" disabled />
              </Div>
              <Div className="space-y-2">
                <Label>With type (password)</Label>
                <Input type="password" defaultValue="secret123" />
              </Div>
              <Div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="name@example.com" />
              </Div>
              <Div className="space-y-2">
                <Label>URL</Label>
                <Input type="url" placeholder="https://example.com" />
              </Div>
            </Div>
          </Div>

          {/* Textarea */}
          <Div className="space-y-2">
            <H3>Textarea</H3>
            <Div className="grid gap-4 md:grid-cols-2">
              <Div className="space-y-2">
                <Label>Default</Label>
                <Textarea placeholder="Enter longer text..." />
              </Div>
              <Div className="space-y-2">
                <Label>Disabled</Label>
                <Textarea placeholder="Disabled textarea" disabled />
              </Div>
            </Div>
          </Div>

          {/* Select */}
          <Div className="space-y-2">
            <H3>Select</H3>
            <Div className="grid gap-4 md:grid-cols-2">
              <Div className="space-y-2">
                <Label>Default</Label>
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
              <Div className="space-y-2">
                <Label>Grouped Select</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="cherry">Cherry</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Vegetables</SelectLabel>
                      <SelectItem value="carrot">Carrot</SelectItem>
                      <SelectItem value="potato">Potato</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Div>
              <Div className="space-y-2">
                <Label>Disabled</Label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Disabled select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="x">X</SelectItem>
                  </SelectContent>
                </Select>
              </Div>
            </Div>
          </Div>

          {/* Multi Select */}
          <Div className="space-y-2">
            <H3>Multi Select</H3>
            <Div className="max-w-md space-y-2">
              <Label>Select frameworks</Label>
              <MultiSelect
                options={[
                  { value: "react", label: "React" },
                  { value: "vue", label: "Vue" },
                  { value: "angular", label: "Angular" },
                  { value: "svelte", label: "Svelte" },
                  { value: "solid", label: "SolidJS" },
                ]}
                value={multiValue}
                onChange={setMultiValue}
                placeholder="Pick frameworks..."
              />
              <Muted>Selected: {multiValue.join(", ")}</Muted>
            </Div>
          </Div>

          {/* Checkbox */}
          <Div className="space-y-2">
            <H3>Checkbox</H3>
            <Div className="space-y-3">
              <Div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <Checkbox id="checked" defaultChecked />
                <Label htmlFor="checked">Pre-checked option</Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <Checkbox id="disabled" disabled />
                <Label htmlFor="disabled" className="opacity-50">
                  Disabled checkbox
                </Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <Checkbox id="disabled-checked" disabled defaultChecked />
                <Label htmlFor="disabled-checked" className="opacity-50">
                  Disabled checked
                </Label>
              </Div>
            </Div>
          </Div>

          {/* Radio Group */}
          <Div className="space-y-2">
            <H3>Radio Group</H3>
            <RadioGroup defaultValue="option1">
              <Div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">Default option</Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">Second option</Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="r3" disabled />
                <Label htmlFor="r3" className="opacity-50">
                  Disabled option
                </Label>
              </Div>
            </RadioGroup>
          </Div>

          {/* Switch */}
          <Div className="space-y-2">
            <H3>Switch</H3>
            <Div className="space-y-3">
              <Div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <Switch id="switch-on" defaultChecked />
                <Label htmlFor="switch-on">Enabled by default</Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <Switch id="switch-disabled" disabled />
                <Label htmlFor="switch-disabled" className="opacity-50">
                  Disabled
                </Label>
              </Div>
            </Div>
          </Div>

          {/* Slider */}
          <Div className="space-y-2">
            <H3>Slider</H3>
            <Div className="space-y-4 max-w-md">
              <Div className="space-y-2">
                <Label>Default ({sliderValue[0]})</Label>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                />
              </Div>
              <Div className="space-y-2">
                <Label>With steps (step: 25)</Label>
                <Slider defaultValue={[50]} max={100} step={25} />
              </Div>
              <Div className="space-y-2">
                <Label>Disabled</Label>
                <Slider defaultValue={[30]} max={100} step={1} disabled />
              </Div>
            </Div>
          </Div>

          {/* Number Input */}
          <Div className="space-y-2">
            <H3>Number Input</H3>
            <Div className="max-w-md space-y-2">
              <Label>Value: {numberValue}</Label>
              <NumberInput value={numberValue} onChange={setNumberValue} />
            </Div>
          </Div>

          {/* Phone Field */}
          <Div className="space-y-2">
            <H3>Phone Field</H3>
            <Div className="max-w-md space-y-2">
              <Label>Phone number</Label>
              <PhoneField
                value={phoneValue}
                onChange={setPhoneValue}
                placeholder="Enter phone number"
              />
              {phoneValue && <Muted>Value: {phoneValue}</Muted>}
            </Div>
          </Div>

          {/* Input OTP */}
          <Div className="space-y-2">
            <H3>Input OTP</H3>
            <Div className="space-y-4">
              <Div className="space-y-2">
                <Label>6-digit code</Label>
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </Div>
            </Div>
          </Div>

          {/* Date Picker */}
          <Div className="space-y-2">
            <H3>Date Picker</H3>
            <Div className="max-w-md space-y-2">
              <Label>Select a date</Label>
              <DatePicker
                value={pickerDate}
                onChange={setPickerDate}
                placeholder="Pick a date"
              />
              {pickerDate && (
                <Muted>Selected: {pickerDate.toLocaleDateString()}</Muted>
              )}
            </Div>
          </Div>

          {/* Calendar */}
          <Div className="space-y-2">
            <H3>Calendar</H3>
            <Div className="flex flex-row flex-wrap gap-4">
              <Div className="space-y-2">
                <Label>Single date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </Div>
            </Div>
            {date && <P>Selected: {date.toLocaleDateString()}</P>}
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
