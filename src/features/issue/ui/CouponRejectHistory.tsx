import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import type {IssueCouponsRejectedInfo} from "../api/getIssueCoupons.ts";

export function CouponRejectHistory({ rejectInfo }: { rejectInfo: IssueCouponsRejectedInfo }) {
    const items: DetailItem[] = [
        {
            id: "publish_date",
            label: "일시",
            value: rejectInfo.decidedAt,
        },
        {
            id: "request_count",
            label: "요청 발행매수",
            value: `${rejectInfo.requestedIssueCount}장`,
        },
        {
            id: "reject_reason",
            label: "반려사유",
            value: rejectInfo.reason,
            stacked: true,
        },
    ];

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col w-full text-xl font-bold gap-4">
                반려 정보
                <DetailBox items={items}/>
            </div>
        </div>
    );
}
