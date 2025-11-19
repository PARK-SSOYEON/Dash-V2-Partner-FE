import * as React from "react";
import {cva} from "class-variance-authority";
import {cn} from "../lib/cn.ts";
import {Icon} from "./Icon.tsx";
import type {ProductSuggestion} from "../../features/issue/model/types.ts";

export type IssueItem = {
    rowId: string;
    productId?: number;
    isNew: boolean;
    name: string;
    qty: number;
};

export type MenuMode = "view" | "edit";

const panelClass = cva(
    "rounded-2xl p-6 bg-(--color-gray-50) border border-(--color-gray-350)",
);

const headerCellClass = cva(
    "text-base font-semibold tracking-tight"
);

const rowClass = cva(
    "grid items-center ",
    {
        variants: {
            mode: {
                view: "grid-cols-[1fr_auto] gap-2 ",
                edit: "grid-cols-[1fr_60px_35px] gap-2 ",
            },
        },
        defaultVariants: {mode: "view"},
    }
);
const qtyTextClass = cva("text-base font-normal");

// 공통: 모드별 입력 스타일 (edit/view)
const inputBaseByMode = cva(
    "text-base font-normal outline-none px-1 py-2",
    {
        variants: {
            mode: {
                edit: "bg-white h-[27px]",
                view: "bg-transparent border-transparent focus:ring-0 cursor-default select-none",
            },
        },
        defaultVariants: {mode: "view"},
    }
);

const nameInputByMode = (opts: { mode?: MenuMode }) =>
    cn("w-full", inputBaseByMode(opts));

const qtyInputByMode = (opts: { mode?: MenuMode }) =>
    cn("w-[45px] text-right", inputBaseByMode(opts));

type MenuInputProps = {
    items: IssueItem[];
    onChange: (items: IssueItem[]) => void;
    onDelete?: (id: string) => void;
    onAdd?: () => void;
    className?: string;
    mode?: MenuMode; // "view" | "edit" (default: "view")

    titleLeft?: string;   // 기본: "품목명"
    titleMid?: string;    // 기본: "발행수량"
    titleRight?: string;  // 기본: "기능" (edit 모드일 때만 보임)

    onSearchKeywordChange?: (keyword: string, rowId: string) => void; // 인풋 타이핑
    suggestionsById?: Record<string, ProductSuggestion[]>;
    onSelectSuggestion?: (rowId: string, productId: number) => void;
};

export const MenuInput: React.FC<MenuInputProps> = ({
                                                        items,
                                                        onChange,
                                                        onDelete,
                                                        onAdd,
                                                        className,
                                                        mode = "view",
                                                        titleLeft = "품목명",
                                                        titleMid = "발행수량",
                                                        titleRight = "기능",
                                                        onSearchKeywordChange,
                                                        suggestionsById,
                                                        onSelectSuggestion,
                                                    }) => {
    const updateItem = React.useCallback(
        (id: string, patch: Partial<IssueItem>) => {
            const next = items.map((it) => (it.rowId === id ? {...it, ...patch} : it));
            onChange(next);
        },
        [items, onChange]
    );

    const handleQtyChange = (id: string, raw: string) => {
        const digits = raw.replace(/[^\d]/g, "");
        const value = digits === "" ? 0 : parseInt(digits, 10);
        updateItem(id, {qty: value});
    };

    return (
        <section className={cn(panelClass(), className)}>
            <div className={cn(rowClass({mode}), "pb-2")}>
                <div className={headerCellClass()}>{titleLeft}</div>
                <div className={cn(headerCellClass(), "text-right")}>{titleMid}</div>
                {mode === "edit" && (
                    <div className={cn(headerCellClass(), "text-right")}>
                        {titleRight}
                    </div>
                )}
            </div>

            <ul>
                {items.map((it) => (
                    <li key={it.rowId} className={rowClass({mode})}>
                        {/* 품목명 */}
                        <input
                            className={nameInputByMode({mode})}
                            value={it.name}
                            onChange={(e) => {
                                const value = e.target.value;
                                updateItem(it.rowId, {name: value, isNew: true, productId: undefined});
                                onSearchKeywordChange?.(value, it.rowId);
                            }}
                            placeholder="제품명을 입력하세요"
                            readOnly={mode === "view"}
                            tabIndex={mode === "view" ? -1 : 0}
                            aria-readonly={mode === "view"}
                        />

                        {suggestionsById?.[it.rowId]?.length ? (
                            <div
                                className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-20 p-2 flex flex-col gap-1"
                            >
                                {suggestionsById[it.rowId].map((s) => (
                                    <button
                                        key={s.productId}
                                        onClick={() => onSelectSuggestion?.(it.rowId, s.productId)}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        ) : null}

                        {/* 발행 수량 + 단위 */}
                        <div className="flex items-center justify-end gap-0">
                            <input
                                className={qtyInputByMode({mode})}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={String(it.qty ?? 0)}
                                onChange={(e) => handleQtyChange(it.rowId, e.target.value)}
                                readOnly={mode === "view"}
                                tabIndex={mode === "view" ? -1 : 0}
                                aria-readonly={mode === "view"}
                            />
                            <span className={qtyTextClass()}>장</span>
                        </div>

                        {/* 삭제 기능 */}
                        {mode === "edit" && (
                            <button
                                type="button"
                                aria-label="행 삭제"
                                className="grid place-items-center w-[40px] h-[40px] rounded-full text-(--color-red-300) bg-white border-(--color-gray-350)"
                                onClick={() => onDelete?.(it.rowId)}
                            >
                                <Icon name={"trashcan"} size={24}/>
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {mode === "edit" && (
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onAdd}
                        className={cn(
                            "w-full",
                            "rounded-full py-2 bg-(--color-gray-350)/60",
                            "text-base font-normal text-black/30",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        제품 추가 <span className="text-2xl leading-none">＋</span>
                    </button>
                </div>
            )}
        </section>
    );
};
