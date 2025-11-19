import * as React from "react";
import {CouponRequestBlock} from "../../../shared/ui/CouponRequestBlock.tsx";
import {cn} from "../../../shared/lib/cn.ts";
import {ToggleButton} from "../../../shared/ui/buttons/ToggleButton.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {useNavigate} from "react-router-dom";
import {useIsLandscape} from "../../../shared/hook/useIsLandscape.ts";
import {ISSUE_STATUS_LABEL, type IssueStatusCode} from "../model/issueStatusType";
import {useIssueListQuery} from "../model/useIssueListQuery.ts";
import {useDeleteIssuesMutation} from "../model/useDeleteIssuesMutation.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {queryClient} from "../../../shared/lib/queryClient.ts";

export function IssueListPage() {
    const navigate = useNavigate();
    const isLandScape = useIsLandscape();

    const [statusFilter] =
        React.useState<IssueStatusCode | "ALL">("ALL");
    const { mutate: deleteIssuesMutate } = useDeleteIssuesMutation();

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

    const { data } = useIssueListQuery({
        status: statusFilter === "ALL" ? undefined : statusFilter,
    });

    const issues = data?.items ?? [];

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
        navigate('./new', {
            state: { isOwner: true }
        });
    };

    const filteredIssues =
        statusFilter === "ALL"
            ? issues
            : issues.filter((issue) => issue.status === statusFilter);

    const handleDelete = () => {
        if (selectedIds.length === 0) return;

        // requestId 배열을 number[]로 변환
        const requestIds = selectedIds.map((id) => Number(id));

        deleteIssuesMutate(
            { issues: requestIds },
            {
                onSuccess: () => {
                    alert("삭제되었습니다.");

                    // 선택모드 종료 + 리스트 갱신
                    setSelectMode(false);
                    setSelectedIds([]);

                    // React Query 캐시 리로드
                    queryClient.invalidateQueries({ queryKey: ["issues"] });
                },
                onError: (error: ApiError) => {
                    if (error.code === "ERR-NOT-YOURS") {
                        alert("삭제할 수 없는 이슈가 포함되어 있습니다.");
                    } else if (error.code === "ERR-AUTH") {
                        alert("로그인 정보가 만료되었습니다.\n다시 로그인해주세요.");
                        navigate("/login");
                    } else {
                        alert(error.message ?? "삭제 중 오류가 발생했습니다.");
                    }
                },
            }
        );
    };

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
                        key={issue.requestId}
                        mode={selectMode ? "select" : "normal"}
                        selected={selectedIds.includes(String(issue.requestId))}
                        onClick={() => handleClickIssue(String(issue.requestId))}
                        title={issue.title}
                        itemCount={issue.productKindCount}
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
                        width: isLandScape
                            ? "calc(((100vw * 2 / 3) - (var(--gutter,48px) * 2))*0.7)"
                            : "calc((100vw - (var(--gutter,48px) * 2))*0.7)",
                        left: isLandScape ? "33vw" : "50%",
                        bottom: "max(2rem, env(safe-area-inset-bottom))",
                        height: "var(--bottom-nav-h,66px)",
                    }}
                    onClick={handleDelete}
                > 삭제하기 </Button>
            )}
        </div>
    );
}
