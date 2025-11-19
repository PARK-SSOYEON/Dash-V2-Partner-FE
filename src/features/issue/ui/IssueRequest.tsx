import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import {type IssueItem, MenuInput} from "../../../shared/ui/MenuInput.tsx";
import {useState} from "react";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {IconButton} from "../../../shared/ui/buttons/IconButton.tsx";
import {Input} from "../../../shared/ui/input/Input.tsx";
import type {IssueRequestDetailResponse} from "../api/getIssueRequestDetail.ts";

export function IssueRequest({issue}: {issue: IssueRequestDetailResponse}) {
    const [openRejectForm, setOpenRejectForm] = useState<boolean>(false);
    const [rejectReason, setRejectReason] = useState<string>("");

    const [menuItems, setMenuItems] = useState<IssueItem[]>([
        {id: "1", name: "오리지널 타코야끼", qty: 5},
        {id: "2", name: "네기 타코야끼", qty: 100},
        {id: "3", name: "눈꽃치즈 타코야끼", qty: 1000},
    ]);

    const isPending = issue.status === "ISSUE_STATUS/PENDING";
    const isDecided = [
        "ISSUE_STATUS/ISSUED",
        "ISSUE_STATUS/REJECTED",
        "ISSUE_STATUS/SHARED",
        "ISSUE_STATUS/COMPLETED"
    ].includes(issue.status);

    const items: DetailItem[] = [
        {
            id: "title",
            label: "요청서 제목",
            value: issue.title,
        },
        {
            id: "name",
            label: "요청자",
            value: issue.vendor.memberName,
        },
        {
            id: "phone",
            label: "연락처",
            value: issue.vendor.number,
        },
        {
            id: "request_date",
            label: "요청일시",
            value: issue.requestedAt,
        },
    ];

    const handleApprove = async () => {
        if (!issue) return;

        try {
            // TODO: 실제 승인/발행 API로 교체
            await fetch(`/api/issues/${issue.issueId}/approve`, {
                method: "POST",
            });
            // 이후 상태 갱신 또는 페이지 이동 처리
            // 예: setIssue({ ...issue, status: "ISSUE_STATUS/ISSUED" });
        } catch (e) {
            console.error("approve error", e);
            // TODO: 에러 토스트 등 처리
        }
    };

    const handleReject = async () => {
        if (!issue) return;

        try {
            // TODO: 실제 반려 API로 교체
            await fetch(`/api/issues/${issue.issueId}/reject`, {
                method: "POST",
            });
            // 예: setIssue({ ...issue, status: "ISSUE_STATUS/REJECTED" });
        } catch (e) {
            console.error("reject error", e);
        }
    };

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col w-full text-xl font-bold gap-4">
                기본 정보
                <DetailBox items={items}/>
            </div>

            <div className="flex flex-col w-full text-xl font-bold gap-4">
                발행품목 및 수량
                <MenuInput items={menuItems} onChange={setMenuItems}/>
            </div>

            {isDecided && (
                <div className="flex flex-col w-full justify-center font-normal text-base text-(--color-gray-400)">
                    이미 발행여부를 결정한 요청서예요
                </div>
            )}

            {(isPending && !openRejectForm) && (
                <div className={"flex flex-col w-full justify-center gap-2"}>
                    <span className="font-normal text-base text-(--color-gray-400) text-center">
                        이 발행요청서를 승인할까요?
                    </span>
                    <div className="flex flex-1 gap-4 flex-row">
                        <Button mode="red_line" onClick={() => setOpenRejectForm(true)}>
                            반려
                        </Button>
                        <Button mode="blue_line" onClick={handleApprove}>
                            승인 및 쿠폰 발행
                        </Button>
                    </div>
                </div>
            )}

            {openRejectForm && (
                <div className={"flex flex-col w-full justify-center gap-2"}>
                    <span className="font-normal text-base text-(--color-gray-400) text-center">
                        반려사유를 함께 입력해주세요
                    </span>
                    <div className={"flex flex-row w-full justify-center gap-4"}>
                        <IconButton mode={"mono"} icon={"leftArrow"} onClick={() => setOpenRejectForm(false)}/>
                        <Input
                            label="반려사유"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                    {rejectReason && (
                        <Button mode="red_line" icon={"confirm"} iconPosition={"right"} onClick={handleReject}>
                            반려 결정
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
