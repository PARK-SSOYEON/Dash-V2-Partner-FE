import * as React from "react";
import {CouponRequestBlock} from "../../../shared/ui/CouponRequestBlock.tsx";
import {cn} from "../../../shared/lib/cn.ts";
import {ToggleButton} from "../../../shared/ui/buttons/ToggleButton.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {useNavigate} from "react-router-dom";

// TODO - status back에 맞춰 수정
export type IssueStatus = "WAITING" | "PAYMENT_PENDING" | "PUBLISHED" | "REJECTED" | "DISTRIBUTED" | "USED";

export interface IssueSummary {
    id: string;
    title: string;
    itemCount: number; // 품목 개수
    status: IssueStatus;
}

// 서버 status 값을 실제 화면에 보여줄 라벨로 변환하는 맵핑
const ISSUE_STATUS_LABEL: Record<IssueStatus, string> = {
    WAITING: "대기중",
    PAYMENT_PENDING: "결제대기",
    PUBLISHED: "발행",
    REJECTED: "반려",
    DISTRIBUTED: "배부",
    USED: "사용완료"
};

export function IssueListPage() {
    const navigate = useNavigate();

    const [issues, setIssues] = React.useState<IssueSummary[]>([]);
    const [statusFilter, setStatusFilter] = React.useState<IssueStatus | "ALL">("ALL");
    const [selectMode, setSelectMode] = React.useState(false);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);
    const showBottomMenu = useUIStore((s) => s.showBottomMenu);

    React.useEffect(() => {
        if (selectMode) {
            hideBottomMenu();
        } else {
            showBottomMenu();
        }
    }, [selectMode, hideBottomMenu, showBottomMenu]);

    // TODO: 추후 여기에서 서버 요청으로 교체
    React.useEffect(() => {
        setIssues(MOCK_ISSUES);
        setStatusFilter("ALL")
    }, []);

    const handleClickIssue = (issueId: string) => {
        if (selectMode) {
            setSelectedIds((prev) => {
                if (prev.includes(issueId)) {
                    return prev.filter((id) => id !== issueId);
                } else {
                    return [...prev, issueId];
                }
            });
        } else {
            navigate(`./${issueId}`)
        }
    };

    const handleClickCreate = () => {
        navigate('./new')
    };

    const filteredIssues =
        statusFilter === "ALL"
            ? issues
            : issues.filter((issue) => issue.status === statusFilter);

    return (
        <div className="flex flex-col pt-4 w-full gap-3">
            <header className="flex items-center justify-between h-17">
                <h1 className="text-3xl font-bold tracking-tight text-black">
                    발행목록
                </h1>

                <ToggleButton
                    leftIcon={"filter"}
                    rightIcon={"select"}
                    onChange={(value) => {
                        // null | "left" | "right"
                        if (value === "right") {
                            setSelectMode(true);
                        } else {
                            setSelectMode(false);
                            setSelectedIds([]);
                        }
                    }}
                />
            </header>

            {/* 새 쿠폰 발행 요청 버튼 */}
            {!selectMode && (
                <button
                    type="button"
                    onClick={handleClickCreate}
                    className={cn(
                        "w-full",
                        "rounded-full py-6 bg-(--color-gray-350)/60 gradient-border",
                        "text-base font-normal text-black/50",
                        "flex items-center justify-center gap-2"
                    )}
                >
                    새 쿠폰발행 요청하기 <span className="text-xl leading-none">＋</span>
                </button>
            )}


            {/*토글*/}

            {/* 발행 이슈 리스트 */}
            <section className="space-y-3">
                {filteredIssues.map((issue) => (
                    <CouponRequestBlock
                        key={issue.id}
                        mode={selectMode ? "select" : "normal"}
                        selected={selectedIds.includes(issue.id)}
                        onClick={() => handleClickIssue(issue.id)}
                        title={issue.title}
                        itemCount={issue.itemCount}
                        statusLabel={ISSUE_STATUS_LABEL[issue.status]}
                    />
                ))}

                {filteredIssues.length === 0 && (
                    <p className="py-8 text-center text-sm text-gray-400">
                        해당 상태의 발행 내역이 없습니다.
                    </p>
                )}
            </section>

            {selectMode && (
                <Button
                    mode="red_line"
                    icon={"trashcan"}
                    iconPosition='left'
                    className={"fixed left-1/2 -translate-x-1/2 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md px-4 "}
                    style={{
                        width: "min(calc(100vw - (var(--gutter,24px) * 2)), calc(var(--container-max,450px) - (var(--gutter,24px) * 2)))",
                        bottom: "max(1.5rem, env(safe-area-inset-bottom))",
                        height: "var(--bottom-nav-h,66px)",
                    }}
                > 삭제하기 </Button>
            )}
        </div>
    );
}


const MOCK_ISSUES: IssueSummary[] = [
    {
        id: "1",
        title: "신입생 간식사업",
        itemCount: 5,
        status: "WAITING",
    },
    {
        id: "2",
        title: "신입생 간식사업",
        itemCount: 5,
        status: "PAYMENT_PENDING",
    },
    {
        id: "3",
        title: "신입생 간식사업",
        itemCount: 5,
        status: "PUBLISHED",
    },
    {
        id: "4",
        title: "신입생 간식사업",
        itemCount: 5,
        status: "REJECTED",
    },
    {
        id: "8",
        title: "신입생 간식사업",
        itemCount: 5,
        status: "REJECTED",
    },
    {
        id: "5",
        title: "신입생 간식사업",
        itemCount: 5,
        status: "REJECTED",
    },
    {
        id: "6",
        title: "신입생 간식사업",
        itemCount: 5,
        status: "REJECTED",
    },
    {
        id: "7",
        title: "신입생 간식사업",
        itemCount: 5,
        status: "REJECTED",
    },
];
