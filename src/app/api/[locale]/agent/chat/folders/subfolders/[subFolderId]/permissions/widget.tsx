/**
 * Custom Widget for Folder Permissions
 * Displays and manages folder permissions with a clean, intuitive UI
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { Shield } from "next-vibe-ui/ui/icons/Shield";
import { Span } from "next-vibe-ui/ui/span";

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import BadgeWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";
import type { FolderPermissionsGetResponseOutput } from "./definition";
import type { FolderPermissionsTranslationKey } from "./i18n";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: FolderPermissionsGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

/**
 * Permission section configuration
 */
interface PermissionSection {
  key: keyof FolderPermissionsGetResponseOutput;
  icon: IconKey;
  labelKey: FolderPermissionsTranslationKey;
  descriptionKey: FolderPermissionsTranslationKey;
}

/**
 * Custom container widget for folder permissions view
 */
export function FolderPermissionsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  const form = useWidgetForm<typeof definition.GET>();

  if (!field.value) {
    return (
      <Div className="flex items-center justify-center p-8 text-muted-foreground">
        <Span>{t("get.noData")}</Span>
      </Div>
    );
  }

  const permissionSections: PermissionSection[] = [
    {
      key: "rolesView",
      icon: "eye",
      labelKey: "get.response.rolesView.label",
      descriptionKey: "patch.rolesView.description",
    },
    {
      key: "rolesManage",
      icon: "settings",
      labelKey: "get.response.rolesManage.label",
      descriptionKey: "patch.rolesManage.description",
    },
    {
      key: "rolesCreateThread",
      icon: "message-square-plus",
      labelKey: "get.response.rolesCreateThread.label",
      descriptionKey: "patch.rolesCreateThread.description",
    },
    {
      key: "rolesPost",
      icon: "send",
      labelKey: "get.response.rolesPost.label",
      descriptionKey: "patch.rolesPost.description",
    },
    {
      key: "rolesModerate",
      icon: "shield-plus",
      labelKey: "get.response.rolesModerate.label",
      descriptionKey: "patch.rolesModerate.description",
    },
    {
      key: "rolesAdmin",
      icon: "shield",
      labelKey: "get.response.rolesAdmin.label",
      descriptionKey: "patch.rolesAdmin.description",
    },
  ];

  const handleEdit = async (): Promise<void> => {
    const subFolderId = form.getValues().subFolderId;
    if (!subFolderId) {
      logger.error("Cannot navigate to edit: missing subFolderId");
      return;
    }
    const permissionsDef = await import("./definition");
    navigation.push(permissionsDef.default.PATCH, {
      urlPathParams: { subFolderId },
      prefillFromGet: true,
      getEndpoint: permissionsDef.default.GET,
      popNavigationOnSuccess: 1,
    });
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex flex-row items-center gap-2 p-6 border-b border-border sticky top-0 bg-background z-10">
        <Shield className="h-5 w-5 text-primary" />
        <Span className="text-lg font-semibold flex-1">
          {t("get.container.title")}
        </Span>
        <Button
          variant="default"
          size="sm"
          onClick={() => void handleEdit()}
          className="ml-auto"
        >
          {t("get.edit")}
        </Button>
      </Div>

      <NavigateButtonWidget field={children.backButton} />

      {/* Description */}
      <Div className="px-6 pt-6 pb-4">
        <Div className="flex gap-2 p-4 rounded-lg bg-info/10 border border-info/20">
          <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-medium text-foreground">
              {t("get.about")}
            </Span>
            <Span className="text-sm text-info">
              {t("get.container.description")}
            </Span>
          </Div>
        </Div>
      </Div>

      {/* Permissions Grid */}
      <Div className="px-6 pb-6">
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissionSections.map((section) => {
            const rolesArray = field.value?.[section.key];
            const hasRoles = rolesArray && rolesArray.length > 0;

            return (
              <Div
                key={section.key}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <Div className="flex flex-col gap-3">
                  {/* Header */}
                  <Div className="flex items-start gap-2">
                    <Div className="p-2 rounded-md bg-primary/10">
                      <Icon
                        icon={section.icon}
                        className="h-4 w-4 text-primary"
                      />
                    </Div>
                    <Div className="flex-1 min-w-0">
                      <Span className="font-semibold text-sm block">
                        {t(section.labelKey)}
                      </Span>
                      <Span className="text-xs text-muted-foreground block mt-1">
                        {t(section.descriptionKey)}
                      </Span>
                    </Div>
                  </Div>

                  {/* Roles */}
                  <Div className="flex flex-wrap gap-2">
                    {hasRoles ? (
                      rolesArray.map((role, index) => (
                        <BadgeWidget
                          key={`${section.key}-${index}-${role}`}
                          field={withValue(
                            children[section.key].child,
                            role,
                            rolesArray,
                          )}
                          fieldName={`${section.key}.${index}`}
                        />
                      ))
                    ) : (
                      <Div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-dashed border-muted-foreground/30">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        <Span className="text-xs text-muted-foreground italic">
                          {t("get.inheritFromParent")}
                        </Span>
                      </Div>
                    )}
                  </Div>
                </Div>
              </Div>
            );
          })}
        </Div>
      </Div>
    </Div>
  );
}
