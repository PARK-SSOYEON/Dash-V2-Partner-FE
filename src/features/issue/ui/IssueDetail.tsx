import { IssueRequest } from "./IssueRequest.tsx";
import { SlideSelector } from "../../../shared/ui/SlideSelector.tsx";
import { useState } from "react";
import { CouponHistory } from "./CouponHistory.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "../../../shared/ui/Icon.tsx";
import { useIssueRequestDetail } from "../model/useIssueRequestDetail";
import {useIssueCoupons} from "../model/useIssueCoupons";
import {CouponRejectHistory} from "./CouponRejectHistory.tsx";

export function IssueDetail() {
    const [tap, setTap] = useState('발행요청서');
    const navigate = useNavigate();

    const { issueId } = useParams<{ issueId: string }>();
    const numericIssueId = issueId ? Number(issueId) : undefined;

    const {
        data: issue,
        isLoading,
        isError,
    } = useIssueRequestDetail(numericIssueId, tap === "발행요청서");

    const status = issue?.status;

    const {
        data: issueCoupons,
        isLoading: isCouponsLoading,
        isError: isCouponsError,
        error: issueCouponsError,
    } = useIssueCoupons(
        numericIssueId,
        tap !== "발행요청서"
    );

    const baseOptions = [
        "발행요청서",
        issue?.status === "ISSUE_STATUS/REJECTED" ? "반려정보" : "쿠폰내역",
        "주요통계",
    ] as const;

    let disabledOptions: string[] = [];

    if (!status) {
        disabledOptions = ["쿠폰내역", "주요통계"];
    } else if (
        status === "ISSUE_STATUS/PENDING" ||
        status === "ISSUE_STATUS/PAYMENT_READY"
    ) {
        disabledOptions = ["쿠폰내역", "주요통계"];
    } else {
        disabledOptions = ["주요통계"];
    }

    return (
        <div className="flex flex-col pt-4 w-full gap-6 min-h-[calc(100vh-var(--bottom-nav-h,66px)-40px)]">
            <header className="flex flex-col justify-between h-17">
                <button className={"flex flex-row gap-2 font-light text-base items-center justify-start"}
                onClick={()=>navigate('/issue')}
                >
                    <Icon name={"leftChevron"} size={24}/> 발행목록
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-black">
                    발행내역 상세
                </h1>
            </header>

            <SlideSelector
                options={baseOptions as unknown as string[]}
                value={tap}
                onChange={setTap}
                disabledOptions={disabledOptions}
            />

            {isLoading && !issue && (
                <div className="text-base text-(--color-gray-400)">
                    이슈 정보를 불러오는 중입니다…
                </div>
            )}

            {isError && !issue && (
                <div className="text-base text-red-500">
                    이슈 정보를 불러올 수 없습니다.
                </div>
            )}

            {tap !== "발행요청서" && isCouponsLoading && (
                <div className="text-base text-(--color-gray-400)">
                    쿠폰/반려 정보를 불러오는 중입니다…
                </div>
            )}

            {tap !== "발행요청서" && isCouponsError && (
                <div className="text-base text-red-500">
                    {issueCouponsError?.message ?? "쿠폰/반려 정보를 불러올 수 없습니다."}
                </div>
            )}

            {issue && tap === "발행요청서" && <IssueRequest issue={issue} />}

            {
                tap === "쿠폰내역" &&
                status !== "ISSUE_STATUS/REJECTED" &&
                issueCoupons &&
                issueCoupons.isApproved && (
                    <CouponHistory issueInfo={issueCoupons.issueInfo} issueId={issueId} />
                )}

            {issue &&
                tap === "반려정보" &&
                status === "ISSUE_STATUS/REJECTED" &&
                issueCoupons &&
                !issueCoupons.isApproved && (
                    <CouponRejectHistory rejectInfo={issueCoupons.rejectInfo} />
                )}
        </div>
    );
}
