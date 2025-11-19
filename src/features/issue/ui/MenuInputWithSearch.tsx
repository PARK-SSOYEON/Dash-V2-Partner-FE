import * as React from "react";
import {type IssueItem, MenuInput, type MenuMode} from "../../../shared/ui/MenuInput.tsx";
import {useProductSuggestions} from "../model/useProductSuggestions.ts";
import type {ProductSuggestion} from "../model/types.ts";

type MenuInputWithSearchProps = {
    partnerId: string;

    items: IssueItem[];
    onChange: (items: IssueItem[]) => void;
    onDelete?: (id: string) => void;
    onAdd?: () => void;
    className?: string;
    mode?: MenuMode;
    titleLeft?: string;
    titleMid?: string;
    titleRight?: string;
};

export const MenuInputWithSearch: React.FC<MenuInputWithSearchProps> = ({
                                                                            partnerId,
                                                                            items,
                                                                            onChange,
                                                                            onDelete,
                                                                            onAdd,
                                                                            className,
                                                                            mode = "edit",
                                                                            titleLeft,
                                                                            titleMid,
                                                                            titleRight,
                                                                        }) => {
    const [keyword, setKeyword] = React.useState("");

    const {
        data: suggestions = [],
    } = useProductSuggestions({
        partnerId,
        keyword,
        size: 20,
    });

    const suggestionsById = React.useMemo(
        () =>
            items.reduce<Record<string, ProductSuggestion[]>>((acc, item) => {
                acc[item.rowId] = suggestions;
                return acc;
            }, {}),
        [items, suggestions]
    );

    const handleSearchKeywordChange = (value: string) => {
        setKeyword(value);
    };

    const handleSelectSuggestion = (itemId: string, productId: number) => {
        const suggestion = suggestionsById[itemId]?.find((s) => s.productId === productId);
        if (!suggestion) return;

        onChange(
            items.map((item) =>
                item.rowId === itemId
                    ? {
                        ...item,
                        isNew: false,
                        productId: suggestion.productId,
                        name: suggestion.name,
                    }
                    : item
            )
        );
    };

    return (
        <MenuInput
            items={items}
            onChange={onChange}
            onDelete={onDelete}
            onAdd={onAdd}
            className={className}
            mode={mode}
            titleLeft={titleLeft}
            titleMid={titleMid}
            titleRight={titleRight}
            onSearchKeywordChange={handleSearchKeywordChange}
            suggestionsById={suggestionsById}
            onSelectSuggestion={handleSelectSuggestion}
        />
    );
};
