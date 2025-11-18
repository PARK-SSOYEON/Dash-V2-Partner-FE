import {Icon} from "../../../shared/ui/Icon.tsx";

interface CouponHistoryItem {
    id: string;
    title: string;
    partner: string;
    usedAt: string;
}

const MOCK_ITEMS: CouponHistoryItem[] = [
    {
        id: "1",
        title: "{{메뉴이름_만약 길다면 이런식으로...}}",
        partner: "{{가게명}}",
        usedAt: "{{사용일시}}",
    },
    {
        id: "2",
        title: "{{메뉴이름_만약 길다면 이런식으로...}}",
        partner: "{{가게명}}",
        usedAt: "{{사용일시}}",
    },
    {
        id: "3",
        title: "{{메뉴이름_만약 길다면 이런식으로...}}",
        partner: "{{가게명}}",
        usedAt: "{{사용일시}}",
    },
];

export function ListView() {
    return (
        <div
            className={
                "rounded-3xl bg-white/80  " +
                "backdrop-blur gradient-border h-full flex"
            }
        >
            {/* 스크롤 되는 영역 */}
            <div className="flex-1 overflow-y-auto">
                {MOCK_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        className={
                            "w-full flex items-center justify-between px-5 py-4 " +
                            "border-b border-black/5 last:border-b-0 active:bg-black/[0.03]"
                        }
                    >
                        <div className="flex flex-col gap-1 text-left min-w-0">
                            <p className="text-sm font-semibold text-black truncate">
                                {item.title}
                            </p>
                            <div className="flex flex-row gap-2 text-[11px] text-black/50">
                                <span>{item.partner}</span>
                                <span>·</span>
                                <span>{item.usedAt}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center flex-shrink-0 pl-3">
                            <Icon name={"rightChevron"} size={24}/>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
