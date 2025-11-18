import {CouponRequestBlock} from "../../../shared/ui/CouponRequestBlock.tsx";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import * as React from "react";
import {Input} from "../../../shared/ui/input/Input.tsx";
import {useState} from "react";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {DropdownSelector} from "../../../shared/ui/dropdown/DropdownSelector.tsx";
import {type IssueItem, MenuInput} from "../../../shared/ui/MenuInput.tsx";

type IssueStep = 1 | 2 | 3 | 4;

type Partner = {
    id: string;
    label: string;
    phone: string;
};

const sampleData: Partner[] = [
    {id: "p1", label: "스타벅스 강남점", phone: "010-1234-5678"},
    {id: "p2", label: "이디야 역삼점", phone: "010-2345-6789"},
    {id: "p3", label: "투썸 강남대로점", phone: "010-3456-7890"},
];

export function IssueCreate() {
    const [step, setStep] = useState<IssueStep>(1);
    const isLastStep = step === 4;

    const [title, setTitle] = useState<string>("");
    const [store, setStore] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const [summaryTitle, setSummaryTitle] = useState<string>("");
    const [summaryStore, setSummaryStore] = useState<string>("");
    const [summaryItemsCount, setSummaryItemsCount] = useState<number>(0);

    const [items, setItems] = React.useState<IssueItem[]>([]);

    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);

    const stepMessages: Record<IssueStep, string> = {
        1: "1. 어떤 쿠폰인가요?",
        2: "2. 누구에게 요청하나요?",
        3: "3. 어떤걸 요청하나요?",
        4: "마지막으로 확인 후\n 하단 '요청 전송' 버튼을\n 눌러주세요",
    };

    const handlePrevStep = () => {
        setStep((prev) => Math.max(1, (prev as IssueStep) - 1) as IssueStep);
    };

    const handleNextStep = () => {
        if (step === 1) {
            setSummaryTitle(title);
        } else if (step === 2) {
            setSummaryStore(store);
        } else if (step === 3) {
            setSummaryItemsCount(items.length);
        }

        setStep((prev) => Math.min(4, (prev as IssueStep) + 1) as IssueStep);
    };

    React.useEffect(() => {
        hideBottomMenu();
    }, []);

    return (
        <div className="flex flex-col pt-4 w-full gap-4 min-h-[calc(100vh-var(--bottom-nav-h,66px)-40px)]">
            <header className="flex items-center justify-between h-17">
                <h1 className="text-3xl font-bold tracking-tight text-black">
                    쿠폰 발행
                </h1>
            </header>

            <CouponRequestBlock
                mode="view"
                title={summaryTitle ? summaryTitle : "#어떤_쿠폰인가요?"}
                subtitle={summaryStore ? summaryStore : "#누구에게_요청하나요?"}
                detailText={summaryItemsCount > 0 ? `${summaryItemsCount}개 품목` : "#어떤걸_요청하나요?"}
                statusLabel="전송대기"
                // 🔵 단계에 따라 파란색으로 만들 줄
                highlightArea={
                    step === 1
                        ? "title"
                        : step === 2
                            ? "subtitle"
                            : step === 3
                                ? "detail"
                                : undefined // 4단계: 다 회색 + status만
                }
                showStatus={isLastStep}
            />

            <div className={"flex flex-col flex-1 bg-white p-8 gradient-border w-full rounded-4xl gap-6 "}>
                <div className={"font-medium text-2xl whitespace-pre-line leading-loose"}>
                    {stepMessages[step]}
                </div>

                <div className={"w-full flex flex-col gap-6"}>
                    {/*1단계*/}
                    {step === 1 && (
                        <Input
                            label="발행요청서 제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    )}

                    {/*2단계*/}
                    {step === 2 && (
                        <>
                            <DropdownSelector
                                placeholder="요청 파트너명"
                                searchPlaceholder="검색 키워드를 입력해주세요"
                                data={sampleData}
                                onSelect={(item) => {
                                    if (!item) {
                                        setStore("");
                                        setPhone("");
                                        return;
                                    }

                                    setStore(item.label);
                                    setPhone(item.phone ?? "");
                                }}
                            />
                            {store && (
                                <Input
                                    label="파트너 연락처"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            )}
                        </>
                    )}

                    {/*3단계*/}
                    {step === 3 && (
                        <MenuInput
                            items={items}
                            onChange={setItems}
                            onDelete={(id) => setItems((prev) => prev.filter((x) => x.id !== id))}
                            onAdd={() =>
                                setItems((prev) => [
                                    ...prev,
                                    {id: crypto.randomUUID(), name: "", qty: 0},
                                ])
                            }
                            mode={"edit"}
                        />
                    )}

                    {/*4단계*/}
                    {step === 4 && (
                        <div className={"font-light text-base leading-loose"}>
                            요청은 파트너의 알림함과 <br/> 문자로 전달돼요
                        </div>
                    )}
                </div>
            </div>

            <div
                className={"flex flex-row gap-3 fixed left-1/2 -translate-x-1/2 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md "}
                style={{
                    width: "min(calc(100vw - (var(--gutter,24px) * 2)), calc(var(--container-max,450px) - (var(--gutter,24px) * 2)))",
                    bottom: "max(1.5rem, env(safe-area-inset-bottom))",
                    height: "var(--bottom-nav-h,66px)",
                }}>
                <Button
                    mode="mono"
                    icon={"leftChevron"}
                    iconPosition='left'
                    onClick={handlePrevStep}
                >
                    {step === 1 ? "발행 취소" : step === 4 ? "옵션 수정" : "이전 입력"}
                </Button>
                <Button
                    mode={step===4 ? "color_fill" : "blue_line"}
                    icon={"rightChevron"}
                    iconPosition='right'
                    onClick={handleNextStep}
                >
                    {step === 4 ? "요청 전송" : "입력 완료"}
                </Button>
            </div>
        </div>
    )
}
