import type { FlashListProps as ShopifyFlashListProps } from '@shopify/flash-list';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import * as React from 'react';

interface IdItem {
  id?: string;
}

interface SectionListProps<TItem> extends ShopifyFlashListProps<TItem> {
  renderSectionHeader: ShopifyFlashListProps<string>['renderItem'];
}

function FlashList<TItem>(
  props: SectionListProps<TItem | string>,
  ref: React.ForwardedRef<ShopifyFlashList<TItem | string>>
) {
  const {
    keyExtractor = (item, index) =>
      typeof item === 'string'
        ? item
        : (item as IdItem)?.id
          ? ((item as IdItem).id ?? String(index))
          : String(index),
    estimatedItemSize = 50,
    renderItem,
    renderSectionHeader,
    ...rest
  } = props;

  const stickyHeaderIndices = useStickyHeaderIndices<TItem>(
    [...(props.data ?? [])],
    props.extraData
  );

  const renderItems = React.useCallback(
    (info: Parameters<NonNullable<ShopifyFlashListProps<TItem | string>['renderItem']>>[0]) => {
      if (typeof info.item === 'string' && renderSectionHeader) {
        // Rendering header
        return renderSectionHeader?.(info);
      } else {
        // Render item
        return renderItem?.(info) ?? null;
      }
    },
    [renderItem, renderSectionHeader]
  );

  return (
    <ShopifyFlashList
      keyExtractor={keyExtractor}
      estimatedItemSize={estimatedItemSize}
      ref={ref}
      stickyHeaderIndices={stickyHeaderIndices}
      getItemType={getItemType}
      renderItem={renderItems}
      {...rest}
    />
  );
}

function getItemType<TItem>(item: TItem) {
  return typeof item === 'string' ? 'sectionHeader' : 'row';
}

function getStickyHeaderIndices<TItem>(data: (string | TItem)[]) {
  if (!data || data.length === 0) {
    return [];
  }
  return data
    .map((item, index) => {
      if (typeof item === 'string') {
        return index;
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);
}

/**
 *
 * @info "Hacky" way to update stickyHeaderIndices when data changes while 👇 issue is being fixed
 * @issue https://github.com/Shopify/flash-list/issues/615
 */
function useStickyHeaderIndices<TItem>(data: (string | TItem)[], _extraData?: unknown) {
  const [_stickyHeadersUpdate, triggerStickyHeadersUpdate] = React.useState<boolean>(false);
  const [, triggerRerender] = React.useState<boolean>(false);
  const stickyHeaderIndices = React.useRef<number[]>([]);
  const actualStickyHeaderIndices = React.useRef<number[]>([]);

  React.useEffect(() => {
    actualStickyHeaderIndices.current = getStickyHeaderIndices(data);
    stickyHeaderIndices.current = [];
    triggerStickyHeadersUpdate((value) => !value);
  }, [data.length, data]);

  React.useEffect(() => {
    stickyHeaderIndices.current = actualStickyHeaderIndices.current;
    triggerRerender((value) => !value);
  }, []);

  return stickyHeaderIndices.current;
}

const SectionList = React.forwardRef(FlashList) as <TItem>(
  props: SectionListProps<TItem | string> & {
    ref?: React.ForwardedRef<ShopifyFlashList<TItem | string>>;
  }
) => ReturnType<typeof FlashList>;

export { SectionList, type SectionListProps };
