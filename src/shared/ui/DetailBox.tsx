import * as React from "react";
import {cn} from "../lib/cn.ts";

type DetailItemCommon = {
    id: string;
    label: string;
    stacked?: boolean;
};

type ViewItem = DetailItemCommon & {
    value: React.ReactNode;
    editable?: false;
};

type EditItem = DetailItemCommon & {
    value: string;
    editable: true;
    onChange: (value: string) => void;
};

export type DetailItem = ViewItem | EditItem;

const detailBoxVariants = "rounded-2xl bg-(--color-gray-50) border border-(--color-gray-350) px-6 py-5"

interface DetailBoxProps {
    items: DetailItem[];
    className?: string;
}

export const DetailBox: React.FC<DetailBoxProps> = ({
                                                        items,
                                                        className,
                                                    }) => {

    return (
        <section className={cn(detailBoxVariants, className)}>
            <div className="flex flex-col gap-3">
                {items.map((item) => {
                    const isEditable = item.editable;
                    const isStacked = item.stacked;

                    if (isStacked) {
                        // 예: 반려사유 - 라벨 한 줄, 그 아래에서 내용 시작
                        return (
                            <div key={item.id} className="flex flex-col gap-1">
                                <div className="font-semibold text-neutral-900">
                                    {item.label}
                                </div>
                                <div className="text-neutral-700 leading-relaxed break-words">
                                    {item.value}
                                </div>
                            </div>
                        );
                    }

                    // 일반적인 한 줄 레이아웃: 왼쪽 라벨, 오른쪽 내용
                    return (
                        <div
                            key={item.id}
                            className="flex flex row items-start gap-x-6 gap-y-1"
                        >
                            <div className="whitespace-nowrap font-medium text-base text-black">
                                {item.label}
                            </div>
                            <div className="text-black font-light text-base leading-relaxed break-words">
                                {isEditable ? (
                                    <textarea
                                        value={item.value as string}
                                        onChange={(e) =>
                                            (item as EditItem).onChange(e.target.value)
                                        }
                                        rows={3}
                                        className={cn(
                                            "w-full resize-none bg-white px-3 py-2",
                                            "text-base leading-relaxed outline-none"
                                        )}
                                    />
                                ) : (
                                    item.value
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
