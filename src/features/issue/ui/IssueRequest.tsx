import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import {type IssueItem, MenuInput} from "../../../shared/ui/MenuInput.tsx";
import {useState} from "react";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {IconButton} from "../../../shared/ui/buttons/IconButton.tsx";
import {Input} from "../../../shared/ui/input/Input.tsx";
import type {IssueRequestDetailResponse} from "../api/getIssueRequestDetail.ts";
import {useNavigate} from "react-router-dom";
import {useRejectIssue} from "../model/useRejectIssue.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export function IssueRequest({issue}: {issue: IssueRequestDetailResponse}) {
    const [openRejectForm, setOpenRejectForm] = useState<boolean>(false);
    const [rejectReason, setRejectReason] = useState<string>("");
    const { mutate: rejectIssue } = useRejectIssue();

    const navigate = useNavigate();

    const [menuItems, setMenuItems] = useState<IssueItem[]>([
        {rowId: "1", isNew: true, name: "오리지널 타코야끼", qty: 5},
        {rowId: "2", isNew: true, name: "네기 타코야끼", qty: 100},
        {rowId: "3", isNew: true, name: "눈꽃치즈 타코야끼", qty: 1000},
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
        navigate(`issue/${issue.issueId}/publish`, {
            state: { isOwner: false , issue: issue}
        })
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            alert("반려 사유를 입력해주세요.");
            return;
        }

        rejectIssue(
            {
                issueId: issue.issueId,
                isApproved: false,
                reason: rejectReason,
            },
            {
                onSuccess: () => {
                    alert("반려 처리되었습니다.");
                    navigate("/issue", { replace: true });
                },
                onError: (error: ApiError) => {
                    if (error.code === "ERR-AUTH") {
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        navigate("/login");
                    } else if (error.code === "ERR-IVD-VALUE") {
                        alert("올바르지 않은 발행 기록입니다.");
                    } else if (error.code === "ERR-ALREADY-DECIDED") {
                        alert("이미 결정된 발행 요청입니다.");
                    } else {
                        alert(error.message ?? "반려 처리 중 오류가 발생했습니다.");
                    }
                },
            }
        );
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
