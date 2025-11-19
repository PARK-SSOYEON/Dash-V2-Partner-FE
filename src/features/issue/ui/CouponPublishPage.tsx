import {useUIStore} from "../../../shared/store/uiStore.ts";
import * as React from "react";
import {useState} from "react";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {type IssueItem, MenuInput} from "../../../shared/ui/MenuInput.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import {formatDate} from "../lib/formDate.ts";
import {useIsLandscape} from "../../../shared/hook/useIsLandscape.ts";

export type IssueInformation = {
    id: string;
    title: string;
    memberName?: string;
    phone?: string;
    date: string;
    menu: IssueItem[];
};


type PublishLocationState =
    | {
    /** 작성자가 본인인지 여부 (본인이 직접 발행) */
    isOwner: true;
    /** 직접 발행이므로 기존 issue 데이터는 없다 */
    issue?: undefined;
}
    | {
    /** 작성자가 본인인지 여부 (타인의 이슈를 발행 처리) */
    isOwner: false;
    /** 발행 처리할 이슈 데이터 (필수) */
    issue: IssueInformation;
};

export function CouponPublishPage() {
    const navigate = useNavigate();
    const showBottomMenu = useUIStore((s) => s.showBottomMenu);
    const isLandScape = useIsLandscape();

    const location = useLocation();
    const state = location.state as PublishLocationState | undefined;

    const isOwner = state?.isOwner ?? true;
    const issue = state && "issue" in state ? state.issue : undefined;

    const [summary, setSummary] = useState("");
    const [createdAtText] = useState(() => formatDate(new Date()));

    // 발행 품목 및 수량 (부모에서 내려준 기본 메뉴 사용)
    const [items, setItems] = React.useState<IssueItem[]>(
        isOwner ? [] : (issue?.menu ?? [])
    );

    React.useEffect(() => {
        showBottomMenu();
    }, [showBottomMenu]);

    const basicItems: DetailItem[] = isOwner
        ? [
            {
                id: "summary",
                label: "발행 적요",
                value: summary,
                editable: true,
                onChange: setSummary,
            },
            {
                id: "createdAt",
                label: "발행서 작성일시",
                value: createdAtText,
            },
        ]
        : issue
            ? [
                {
                    id: "title",
                    label: "요청서 제목",
                    value: issue.title,
                },
                {
                    id: "requester",
                    label: "요청자",
                    value: issue.memberName ?? "-",
                },
                {
                    id: "phone",
                    label: "연락처",
                    value: issue.phone ?? "-",
                },
                {
                    id: "date",
                    label: "요청일시",
                    value: issue.date,
                },
            ]
            : [];

    const handleSubmit = () => {
        // TODO: 실제 발행 API 연동 시 summary, createdAtText, items 등을 함께 전송
        navigate("./issue");
    };

    if (!isOwner && !issue) {
        return (
            <div className="p-4 text-red-600">
                요청서 정보를 불러오지 못했습니다. (issue가 없습니다)
            </div>
        );
    }

    return (
        <div className="flex flex-col pt-4 w-full gap-4 min-h-[calc(100vh-var(--bottom-nav-h,66px)-40px)]">
            <header className="flex items-center justify-between h-17">
                <h1 className="text-3xl font-bold tracking-tight text-black">
                    쿠폰 발행
                </h1>
            </header>

            {/* 기본 정보 */}
            <div className="flex flex-col w-full text-xl font-bold gap-4">
                기본 정보
                <DetailBox items={basicItems}/>
            </div>

            {/* 발행 품목 및 수량 */}
            <div className="flex flex-col w-full text-xl font-bold gap-4 mt-4">
                발행품목 및 수량
                <MenuInput
                    items={items}
                    onChange={setItems}
                    onDelete={(id) =>
                        setItems((prev) => prev.filter((x) => x.id !== id))
                    }
                    onAdd={() =>
                        setItems((prev) => [
                            ...prev,
                            {id: crypto.randomUUID(), name: "", qty: 0},
                        ])
                    }
                    mode="edit"
                />

                <div
                    className={
                        "flex flex-col gap-2 mt-6"
                    }
                >
                    <span className="font-normal text-base text-(--color-gray-400) text-center">
                      위 정보로 쿠폰을 발행합니다
                    </span>
                    <Button mode="blue_line" onClick={handleSubmit}>
                        쿠폰 발행
                    </Button>
                </div>
            </div>
        </div>
    );
}
