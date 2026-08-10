import { Box, Text } from "ink";
import type { JSX } from "react";

import type {
  FormFieldGroupProps,
  FormSectionProps,
} from "../../../web/ui/form/form-section";

export type {
  FormFieldGroupProps,
  FormSectionProps,
} from "../../../web/ui/form/form-section";

const SPACE = "\u0020";
const SLASH = "\u002F";

export function FormFieldGroup({
  children,
  title,
  description,
}: FormFieldGroupProps): JSX.Element {
  return (
    <Box flexDirection="column">
      {title !== undefined && (
        <Box flexDirection="column">
          <Text bold>{title}</Text>
          {description !== undefined && <Text dimColor>{description}</Text>}
        </Box>
      )}
      <Box flexDirection="column">{children}</Box>
    </Box>
  );
}

export function FormSection({
  children,
  title,
  description,
  completionStatus,
}: FormSectionProps): JSX.Element {
  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>{title}</Text>
        {completionStatus !== undefined && (
          <Text dimColor>
            {SPACE}
            {completionStatus.completedFields}
            {SLASH}
            {completionStatus.totalFields}
          </Text>
        )}
      </Box>
      {description !== undefined && <Text dimColor>{description}</Text>}
      <Box flexDirection="column">{children}</Box>
    </Box>
  );
}
