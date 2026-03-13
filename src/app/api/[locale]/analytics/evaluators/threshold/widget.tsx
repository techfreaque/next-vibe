/**
 * Vibe Sense — Threshold Evaluator Widget
 * Op selector + value input for the node inspector.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";

import type { ThresholdParams } from "./definition";

interface Props {
  params: Partial<ThresholdParams>;
  onChange: (params: ThresholdParams) => void;
}

const OPS = [">", "<", ">=", "<=", "=="] as const;

export function ThresholdWidget({
  params,
  onChange,
}: Props): React.JSX.Element {
  const op = params.op ?? ">";
  const value = params.value ?? 0;

  return (
    <Div className="flex gap-2 items-center">
      <Select
        value={op}
        onValueChange={(v) =>
          onChange({ op: v as ThresholdParams["op"], value })
        }
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPS.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={value}
        onChangeText={(text) => onChange({ op, value: Number(text) })}
        className="w-24"
      />
    </Div>
  );
}
