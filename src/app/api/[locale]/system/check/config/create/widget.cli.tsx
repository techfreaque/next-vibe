/**
 * Config Create CLI Widget
 *
 * Handles two modes:
 *   - interactive=true (default for CLI): step-by-step yes/no wizard via Ink
 *   - interactive=false (non-interactive / MCP): plain submission, then result display
 *
 * Interactive flow is driven entirely here in the widget - the repository
 * receives final resolved boolean values and never runs @inquirer/prompts.
 */

import chalk from "chalk";
import { Box, Text, useInput, useStdin } from "ink";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetPlatform,
  useWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { ConfigCreateResponseOutput } from "./definition";
import type defintion from "./definition";

// ── Types ─────────────────────────────────────────────────────────────────

interface CliWidgetProps {
  field: {
    value: ConfigCreateResponseOutput | null | undefined;
  };
  fieldName: string;
}

interface WizardStep {
  key: keyof typeof STEP_LABELS;
  label: string;
  defaultValue: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────

// eslint-disable-next-line i18next/no-literal-string
const WIZARD_TITLE = "\uD83D\uDD27 Interactive Configuration Setup";

// ── Step definitions ──────────────────────────────────────────────────────

// eslint-disable-next-line i18next/no-literal-string
const STEP_LABELS = {
  // eslint-disable-next-line i18next/no-literal-string
  createMcpConfig: "Create MCP config (.mcp.json / mcp.json)?",
  // eslint-disable-next-line i18next/no-literal-string
  updateVscodeSettings: "Update VSCode settings (.vscode/settings.json)?",
  // eslint-disable-next-line i18next/no-literal-string
  updatePackageJson: "Update package.json scripts (check, lint, typecheck)?",
  // eslint-disable-next-line i18next/no-literal-string
  enableEslint:
    "Enable ESLint? (import sorting, React hooks - slower but catches more)",
  // eslint-disable-next-line i18next/no-literal-string
  enableReactRules: "Enable React-specific linting rules?",
  // eslint-disable-next-line i18next/no-literal-string
  enableNextjsRules: "Enable Next.js-specific linting rules?",
  // eslint-disable-next-line i18next/no-literal-string
  enableI18nRules: "Enable i18n linting rules?",
  // eslint-disable-next-line i18next/no-literal-string
  jsxCapitalization: "Enforce JSX component name capitalization?",
  // eslint-disable-next-line i18next/no-literal-string
  enablePedanticRules: "Enable stricter/pedantic rules?",
  // eslint-disable-next-line i18next/no-literal-string
  enableRestrictedSyntax: "Restrict throw, unknown, and object types?",
} as const;

const WIZARD_STEPS: WizardStep[] = [
  {
    key: "createMcpConfig",
    label: STEP_LABELS.createMcpConfig,
    defaultValue: true,
  },
  {
    key: "updateVscodeSettings",
    label: STEP_LABELS.updateVscodeSettings,
    defaultValue: true,
  },
  {
    key: "updatePackageJson",
    label: STEP_LABELS.updatePackageJson,
    defaultValue: true,
  },
  {
    key: "enableEslint",
    label: STEP_LABELS.enableEslint,
    defaultValue: true,
  },
  {
    key: "enableReactRules",
    label: STEP_LABELS.enableReactRules,
    defaultValue: true,
  },
  {
    key: "enableNextjsRules",
    label: STEP_LABELS.enableNextjsRules,
    defaultValue: true,
  },
  {
    key: "enableI18nRules",
    label: STEP_LABELS.enableI18nRules,
    defaultValue: true,
  },
  {
    key: "jsxCapitalization",
    label: STEP_LABELS.jsxCapitalization,
    defaultValue: false,
  },
  {
    key: "enablePedanticRules",
    label: STEP_LABELS.enablePedanticRules,
    defaultValue: false,
  },
  {
    key: "enableRestrictedSyntax",
    label: STEP_LABELS.enableRestrictedSyntax,
    defaultValue: true,
  },
];

// ── Result display ─────────────────────────────────────────────────────────

function renderResult(
  value: ConfigCreateResponseOutput,
  isMcp: boolean,
): string {
  if (isMcp) {
    return value.message;
  }
  const lines = value.message.split("\n").map((line) => {
    if (line.startsWith("\u2713")) {
      return chalk.green(line);
    }
    if (line.startsWith("\u2717") || line.toLowerCase().includes("error")) {
      return chalk.red(line);
    }
    return chalk.dim(line);
  });
  return lines.join("\n");
}

// ── Interactive wizard ─────────────────────────────────────────────────────

interface WizardProps {
  onSubmit: (answers: Record<string, boolean>) => void;
}

function ConfigCreateWizard({ onSubmit }: WizardProps): JSX.Element {
  const { isRawModeSupported } = useStdin();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const step = WIZARD_STEPS[stepIdx];
  const isLast = stepIdx === WIZARD_STEPS.length - 1;

  const answer = useCallback(
    (value: boolean): void => {
      if (!step) {
        return;
      }
      const newAnswers = { ...answers, [step.key]: value };
      setAnswers(newAnswers);
      if (isLast) {
        onSubmit(newAnswers);
      } else {
        setStepIdx((i) => i + 1);
      }
    },
    [step, answers, isLast, onSubmit],
  );

  useInput(
    (input, key) => {
      if (input === "y" || input === "Y") {
        answer(true);
      } else if (input === "n" || input === "N") {
        answer(false);
      } else if (key.return) {
        // Enter accepts the default value for the current step
        answer(step?.defaultValue ?? true);
      }
    },
    { isActive: isRawModeSupported },
  );

  if (!step) {
    return <Box />;
  }

  const completed = WIZARD_STEPS.slice(0, stepIdx);

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {WIZARD_TITLE}
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text dimColor>
          {`Step ${String(stepIdx + 1)}/${String(WIZARD_STEPS.length)}`}
        </Text>
      </Box>

      {/* Completed steps summary */}
      {completed.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          {completed.map((s) => (
            <Box key={s.key}>
              <Text color="green">{`  \u2713 `}</Text>
              <Text dimColor>{s.label}</Text>
              <Text color={answers[s.key] ? "green" : "red"}>
                {/* eslint-disable-next-line i18next/no-literal-string */}
                {answers[s.key] ? " yes" : " no"}
              </Text>
            </Box>
          ))}
        </Box>
      )}

      {/* Current question */}
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
      >
        <Text bold>{step.label}</Text>
        <Box marginTop={1}>
          <Text dimColor>
            {/* eslint-disable-next-line i18next/no-literal-string */}
            {`default: ${step.defaultValue ? "yes" : "no"}  \u2014 [y] yes  [n] no  [Enter] accept default`}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

// ── Main widget ────────────────────────────────────────────────────────────

export function ConfigCreateCliWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;
  const responseOnly = useWidgetResponseOnly();
  const form = useWidgetForm<typeof defintion.POST>();
  const ctx = useWidgetContext();

  const value = field.value;
  const interactive = (form?.getValues("interactive") ?? true) !== false;

  // Once a result comes back, show it
  if (value) {
    const text = renderResult(value, isMcp);
    return (
      <Box flexDirection="column">
        <Text wrap="truncate-end">{text}</Text>
      </Box>
    );
  }

  // MCP or response-only: no interactive wizard
  if (isMcp || responseOnly || !interactive) {
    return <Box />;
  }

  // Interactive wizard: collect answers, push them into form, then trigger submit
  return (
    <ConfigCreateWizard
      onSubmit={(answers): void => {
        if (!form) {
          return;
        }
        for (const [key, val] of Object.entries(answers) as Array<
          [Parameters<typeof form.setValue>[0], boolean]
        >) {
          form.setValue(key, val);
        }
        // Mark as non-interactive so repository skips any prompt logic
        form.setValue("interactive", false);
        ctx.onSubmit?.();
      }}
    />
  );
}

ConfigCreateCliWidget.cliWidget = true as const;

// Alias so the Bun plugin can resolve from widget.tsx's export name
export { ConfigCreateCliWidget as ConfigCreateWidget };
