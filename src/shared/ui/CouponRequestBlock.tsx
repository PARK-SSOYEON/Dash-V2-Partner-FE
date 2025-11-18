import {Icon} from "./Icon.tsx";
import {cva} from 'class-variance-authority';
import {cn} from "../lib/cn.ts";

export type CouponRequestMode = 'normal' | 'select' | 'view';

const statusColorClassMap: Record<string, string> = {
    전송대기: 'text-(--color-gray-500)',
    대기중: 'text-(--color-gray-500)',
    결제대기: 'text-(--color-yellow-500)',
    발행: 'text-(--color-blue-500)',
    반려: 'text-(--color-red-300)',
    배부: 'text-(--color-green-500)',
    사용완료: 'text-(--color-gray-500)',
};

export interface CouponRequestBlockProps {
    mode: CouponRequestMode;
    selected?: boolean; //선택 모드 (선택 여부)
    onClick?: () => void; //일반모드 (클릭 시 이동)

    title: string;
    subtitle?: string;
    subtitle2?: string;
    itemCount?: number;
    statusLabel: string;

    detailText?: string;                       // 3번째 줄 문구 직접 지정
    highlightArea?: 'title' | 'subtitle' | 'detail'; // 파란색으로 강조할 줄
    showStatus?: boolean;
}

const couponRequestBlock = cva(
    'w-full rounded-[36px] bg-white px-8 py-6 flex items-center justify-between transition-shadow',
    {
        variants: {
            selected: {
                true: 'border-(--color-blue-500) border-2',
                false: 'gradient-border',
            },
            mode: {
                normal: 'cursor-pointer',
                view: 'cursor-default',
                select: 'cursor-pointer',
            },
        },
        defaultVariants: {
            selected: false,
            mode: 'normal',
        },
    }
);

export const CouponRequestBlock = ({
                                       mode,
                                       selected = false,
                                       onClick,
                                       title,
                                       subtitle,
                                       subtitle2,
                                       itemCount,
                                       statusLabel,
                                       detailText,
                                       highlightArea,
                                       showStatus = true,
                                   }: CouponRequestBlockProps) => {
    const isClickable = mode !== 'view';
    const borderSelected = selected && mode === 'select';
    const colorClass = statusColorClassMap[statusLabel] ?? 'text-(--color-gray-500)';
    const isView = mode === 'view';

    const baseClasses = cn(
        couponRequestBlock({selected: borderSelected, mode})
    );

    const detail =
        detailText ??
        (typeof itemCount === 'number' ? `${itemCount}개 품목` : undefined);

    return (
        <div
            className={baseClasses}
            onClick={isClickable ? onClick : undefined}
            role={isClickable ? 'button' : undefined}
        >
            {/* 왼쪽 텍스트 영역 */}
            <div className="min-w-0">
                <div className={cn("text-xl font-bold truncate",
                    !isView && "text-black",
                    isView &&
                    (highlightArea === 'title'
                        ? "text-(--color-blue-500)"
                        : "text-(--color-gray-500)")
                )}>
                    {title}
                </div>

                {subtitle ?
                    <div
                        className={cn(
                            "mt-0.5 text-sm truncate",
                            !isView && "text-black",
                        )}
                    >
                        <span className={(isView && highlightArea === 'subtitle'
                            ? "text-(--color-blue-500)"
                            : "text-black/30")}>{subtitle}</span>
                        <span className={"text-black/30"}>
                            {subtitle2 ? ` ${subtitle2}` : ""}</span>
                    </div>
                    : null}

                {detail ?
                    <div
                        className={cn(
                            "mt-2 text-base font-normal truncate",
                            isView
                                ? highlightArea === 'detail'
                                    ? "text-(--color-blue-500)"
                                    : "text-black/30"
                                : "text-black/30"
                        )}
                    >
                        {detail}
                    </div>
                    : null}
            </div>

            {showStatus && (
                <div className="flex items-center gap-2 shrink-0">
                    <span className={[
                        'text-xl font-bold',
                        colorClass,
                    ].join(' ')}>
                      {statusLabel}
                    </span>
                    {mode !== 'view' ? <Icon name="right" size={24}/> : null}
                </div>
            )}
        </div>
    );
}
