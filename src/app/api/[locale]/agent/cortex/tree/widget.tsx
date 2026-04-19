/**
 * Cortex Tree Widget (Web)
 * Tree viewer with monospace ASCII tree, mount-specific icons, and stats badges.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { FolderOpen } from "next-vibe-ui/ui/icons/FolderOpen";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { SquareCheck } from "next-vibe-ui/ui/icons/SquareCheck";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetDisabled,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

/** Mount-specific badges for the tree stats bar */
const MOUNT_BADGES: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
  pathPrefix: string;
}[] = [
  {
    icon: Brain,
    color: "text-purple-500",
    label: "memories",
    pathPrefix: "memories/",
  },
  {
    icon: FileText,
    color: "text-blue-500",
    label: "documents",
    pathPrefix: "documents/",
  },
  {
    icon: MessageSquare,
    color: "text-cyan-500",
    label: "threads",
    pathPrefix: "threads/",
  },
  {
    icon: Zap,
    color: "text-amber-500",
    label: "skills",
    pathPrefix: "skills/",
  },
  {
    icon: SquareCheck,
    color: "text-green-500",
    label: "tasks",
    pathPrefix: "tasks/",
  },
];

export function CortexTreeWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const isDisabled = useWidgetDisabled();

  // Detect which mounts are present in the tree
  const presentMounts = value
    ? MOUNT_BADGES.filter((m) => value.tree.includes(m.pathPrefix))
    : [];

  return (
    <Div className="flex flex-col gap-4">
      {/* Form */}
      {!isDisabled && (
        <Div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
          <Div className="grid grid-cols-12 gap-4">
            <Div className="col-span-8">
              <TextFieldWidget fieldName="path" field={children.path} />
            </Div>
            <Div className="col-span-4">
              <NumberFieldWidget fieldName="depth" field={children.depth} />
            </Div>
          </Div>
          <FormAlertWidget field={{}} />
          <Div className="flex gap-2">
            <SubmitButtonWidget<typeof definition.GET>
              field={{
                text: "get.submitButton.label",
                loadingText: "get.submitButton.loadingText",
                icon: "folder-tree",
                variant: "primary",
              }}
            />
          </Div>
        </Div>
      )}

      {/* Response */}
      {value && (
        <Div className="flex flex-col gap-3">
          {/* Stats */}
          <Div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              <Span>
                {value.totalFiles} {t("get.response.totalFiles.text")}
              </Span>
            </Badge>
            <Badge variant="outline" className="gap-1">
              <FolderOpen className="h-3 w-3" />
              <Span>
                {value.totalDirs} {t("get.response.totalDirs.text")}
              </Span>
            </Badge>
            {presentMounts.map((mount) => {
              const MountIcon = mount.icon;
              return (
                <Badge key={mount.label} variant="outline" className="gap-1">
                  <MountIcon className={`h-3 w-3 ${mount.color}`} />
                  <Span>{mount.label}</Span>
                </Badge>
              );
            })}
          </Div>

          {/* Tree */}
          <Div className="rounded-lg border bg-muted/30 overflow-auto max-h-[600px]">
            <Pre className="p-4 text-sm font-mono whitespace-pre">
              {value.tree}
            </Pre>
          </Div>
        </Div>
      )}
    </Div>
  );
}
