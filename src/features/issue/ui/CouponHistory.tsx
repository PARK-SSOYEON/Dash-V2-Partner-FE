import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import {type IssueItem, MenuInput} from "../../../shared/ui/MenuInput.tsx";
import * as React from "react";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import type {IssueCouponsApprovedInfo} from "../api/getIssueCoupons.ts";

export function CouponHistory({issueInfo}: {issueInfo: IssueCouponsApprovedInfo}) {
    const items: DetailItem[] = [
        {
            id: "publish_date",
            label: "일시",
            value: issueInfo.decidedAt,
        },
        {
            id: "request_count",
            label: "요청 발행매수",
            value: `${issueInfo.requestedIssueCount}장`,
        },
        {
            id: "total_count",
            label: "전체 발행매수",
            value: `${issueInfo.approvedIssueCount}장`,
        },
        {
            id: "valid_days",
            label: "유효기간",
            value: `발행일로부터 ${issueInfo.validDays}일`,
        },
    ];

    const [menuItems, setMenuItems] = React.useState<IssueItem[]>([
        { id: "1", name: "오리지널 타코야끼", qty: 5 },
        { id: "2", name: "네기 타코야끼", qty: 100 },
        { id: "3", name: "눈꽃치즈 타코야끼", qty: 1000 }
    ]);


    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col w-full text-xl font-bold gap-4">
                발행 정보
                <DetailBox items={items}/>
            </div>

            <div className="flex flex-col w-full text-xl font-bold gap-4">
                상세 발행내역
                <MenuInput
                    items={menuItems}
                    onChange={setMenuItems}
                />
            </div>

            <div className="flex flex-col w-full text-xl font-bold gap-4">
                발행쿠폰 내보내기
                <Button
                    mode="blue_line"
                    icon={"list"}
                    iconPosition='left'
                > 전체명단 </Button>
                <Button
                    mode="blue_line"
                    icon={"coupon"}
                    iconPosition='left'
                > 등록용 지류쿠폰 </Button>
            </div>
        </div>
    );
}
