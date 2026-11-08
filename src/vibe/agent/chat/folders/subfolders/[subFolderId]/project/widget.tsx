"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { JSX } from "react";

import type definition from "./definition";

type PatchDefinition = (typeof definition)["PATCH"];

interface EditWidgetProps {
  field: PatchDefinition["fields"];
}

/**
 * Folder project overview - instructions + knowledge files. Edit / add / remove
 * launch the PATCH / POST / DELETE endpoint forms via the navigation stack.
 */
export function FolderProjectContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  const form = useWidgetForm<typeof definition.GET>();
  const value = useWidgetValue<typeof definition.GET>();

  if (!value) {
    return (
      <Div className="flex items-center justify-center p-8 text-muted-foreground">
        <Span>{t("get.noData")}</Span>
      </Div>
    );
  }

  const getSubFolderId = (): string | null => {
    const id = form.getValues().subFolderId;
    if (!id) {
      logger.error("Folder project: missing subFolderId");
      return null;
    }
    return id;
  };

  const editInstructions = async (): Promise<void> => {
    const subFolderId = getSubFolderId();
    if (!subFolderId) {
      return;
    }
    const def = await import("./definition");
    navigation.push(def.default.PATCH, {
      urlPathParams: { subFolderId },
      prefillFromGet: true,
      getEndpoint: def.default.GET,
      popNavigationOnSuccess: 1,
    });
  };

  const addFile = async (): Promise<void> => {
    const subFolderId = getSubFolderId();
    if (!subFolderId) {
      return;
    }
    const def = await import("./files/definition");
    navigation.push(def.default.POST, {
      urlPathParams: { subFolderId },
      popNavigationOnSuccess: 1,
    });
  };

  const removeFile = async (fileId: string): Promise<void> => {
    const subFolderId = getSubFolderId();
    if (!subFolderId) {
      return;
    }
    const def = await import("./files/[fileId]/definition");
    navigation.push(def.default.DELETE, {
      urlPathParams: { subFolderId, fileId },
      popNavigationOnSuccess: 1,
    });
  };

  const hasInstructions = !!value.instructions && value.instructions.length > 0;

  return (
    <Div className="flex flex-col gap-5 p-4 sm:p-6">
      <Div className="flex flex-col gap-1">
        <Span className="text-base font-semibold text-foreground">
          {value.folderName}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("get.subheading")}
        </Span>
      </Div>

      {/* Instructions */}
      <Div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
        <Div className="flex flex-row items-center gap-2">
          <Icon icon="sparkles" className="h-4 w-4 text-primary" />
          <Span className="flex-1 text-sm font-semibold">
            {t("get.instructionsTitle")}
          </Span>
          {value.canManage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void editInstructions()}
            >
              {hasInstructions
                ? t("get.editInstructions")
                : t("get.addInstructions")}
            </Button>
          )}
        </Div>
        {hasInstructions ? (
          <Span className="whitespace-pre-wrap break-words text-sm text-foreground/90">
            {value.instructions}
          </Span>
        ) : (
          <Span className="text-sm italic text-muted-foreground">
            {t("get.noInstructions")}
          </Span>
        )}
      </Div>

      {/* Knowledge files */}
      <Div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
        <Div className="flex flex-row items-center gap-2">
          <Icon icon="file-text" className="h-4 w-4 text-primary" />
          <Span className="flex-1 text-sm font-semibold">
            {t("get.knowledgeTitle")}
          </Span>
          {value.canManage && (
            <Button variant="outline" size="sm" onClick={() => void addFile()}>
              {t("get.addFile")}
            </Button>
          )}
        </Div>
        {value.files.length === 0 ? (
          <Span className="text-sm italic text-muted-foreground">
            {t("get.noFiles")}
          </Span>
        ) : (
          <Div className="flex flex-col divide-y divide-border">
            {value.files.map((file) => (
              <Div
                key={file.fileId}
                className="flex flex-row items-center gap-2 py-2"
              >
                <Div className="flex min-w-0 flex-1 flex-col">
                  <Span className="truncate text-sm font-medium">
                    {file.name}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {file.size} {t("get.bytes")}
                  </Span>
                </Div>
                {value.canManage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void removeFile(file.fileId)}
                  >
                    {t("get.removeFile")}
                  </Button>
                )}
              </Div>
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
}

/** Instructions editor - the PATCH form (textarea + back + save). */
export function FolderProjectEditContainer({
  field: { children },
}: EditWidgetProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4 p-4 sm:p-6">
      <TextareaFieldWidget
        field={children.instructions}
        fieldName="instructions"
      />
      <NavigateButtonWidget field={children.backButton} />
      <SubmitButtonWidget<PatchDefinition> field={children.submitButton} />
    </Div>
  );
}
