/**
 * Custom Widget for Character Card Import
 * Card file + visibility form with a short "what comes over" list; after
 * import, a result card with the credit line and a button that opens the
 * new character.
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Image } from "next-vibe/ui/components/image";
import { Li } from "next-vibe/ui/components/li";
import { Span } from "next-vibe/ui/components/span";
import { Ul } from "next-vibe/ui/components/ul";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FileFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/file-field/widget";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useCallback, useMemo } from "react";

import { resolveMediaSrc } from "../../../chat/storage/media-src";
import { scopedTranslation as importTranslation } from "../i18n";
import type definition from "./definition";
import type { SkillCardImportPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

function CardImportResult({
  result,
}: {
  result: SkillCardImportPostResponseOutput;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t: tImport } = importTranslation.scopedT(locale);
  const navigation = useWidgetNavigation();

  const openSkill = useCallback(async (): Promise<void> => {
    const skillDetailDef = await import("../../[id]/definition");
    navigation.push(skillDetailDef.default.GET, {
      urlPathParams: { id: result.id },
    });
  }, [navigation, result.id]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 text-sm font-medium text-success">
        <CheckCircle className="h-4 w-4 shrink-0" />
        <Span>
          {result.alreadyImported
            ? t("post.result.alreadyImported", { name: result.name })
            : t("post.result.imported", { name: result.name })}
        </Span>
      </Div>

      <Div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <Span className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
          {result.avatarUrl ? (
            <Image
              src={resolveMediaSrc(result.avatarUrl)}
              alt={result.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon icon="theater" className="h-6 w-6 text-muted-foreground" />
          )}
        </Span>
        <Div className="flex min-w-0 flex-col gap-0.5">
          <Span className="truncate font-semibold">{result.name}</Span>
          <Span className="truncate text-xs text-muted-foreground">
            {result.creatorName
              ? tImport("post.result.cardCredit", {
                  creator: result.creatorName,
                })
              : tImport("post.result.cardCreditUnknown")}
          </Span>
          {result.importedFields.length > 0 && (
            <Span className="text-xs text-muted-foreground">
              {t("post.result.fieldsList", {
                fields: result.importedFields
                  .map((name) => t(`post.fields.${name}`))
                  .join(", "),
              })}
            </Span>
          )}
        </Div>
      </Div>

      <Button onClick={openSkill} className="self-end">
        {t("post.result.openSkill")}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Div>
  );
}

export function SkillCardImportContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const emptyField = useMemo(() => ({}), []);

  if (data?.id) {
    return <CardImportResult result={data} />;
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <SubmitButtonWidget<typeof definition.POST>
          field={children.submitButton}
        />
      </Div>

      <Div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <Span>{t("post.intro")}</Span>
        <Span className="text-xs">{t("post.supported")}</Span>
      </Div>

      <Div className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3">
        <Span className="text-sm font-medium">{t("post.mapping.title")}</Span>
        <Ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
          <Li>{t("post.mapping.fields")}</Li>
          <Li>{t("post.mapping.avatar")}</Li>
          <Li>{t("post.mapping.safe")}</Li>
        </Ul>
      </Div>

      <FormAlertWidget field={emptyField} />

      <FileFieldWidget fieldName="card" field={children.card} />
      <SelectFieldWidget fieldName="visibility" field={children.visibility} />
    </Div>
  );
}
