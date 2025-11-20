import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import {type IssueItem, MenuInput} from "../../../shared/ui/MenuInput.tsx";
import * as React from "react";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import type {IssueCouponsApprovedInfo} from "../api/getIssueCoupons.ts";
import {useExportIssueCouponList} from "../model/useExportIssueCouponList.ts";
import {useExportIssueCouponImage} from "../model/useExportIssueCouponImage.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {useNavigate} from "react-router-dom";

type CouponHistoryProps = {
    issueInfo: IssueCouponsApprovedInfo;
    issueId?: string;
};

export function CouponHistory({issueInfo, issueId}: CouponHistoryProps) {
    const {mutate: exportList} = useExportIssueCouponList();
    const {mutate: exportImage} = useExportIssueCouponImage();
    const navigate = useNavigate();

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

    const [menuItems, setMenuItems] = React.useState<IssueItem[]>(() =>
        issueInfo.products.map((product, index) => ({
            rowId: String(product.productId ?? index + 1),
            productId: product.productId,
            isNew: !product.productId,
            name: product.productName ?? "",
            qty: product.count,
        }))
    );

    React.useEffect(() => {
        setMenuItems(
            issueInfo.products.map((product, index) => ({
                rowId: String(product.productId ?? index + 1),
                productId: product.productId,
                isNew: !product.productId,
                name: product.productName ?? "",
                qty: product.count,
            }))
        );
    }, [issueInfo.products]);

    const handleListDownload = () => {
        if (!issueId) return;

        const numericIssueId = Number(issueId);
        if (Number.isNaN(numericIssueId)) return;

        exportList(numericIssueId, {
            onSuccess: (data) => {
                window.open(data.url, "_blank");
            },
            onError: (error: ApiError) => {
                if (error.code === "ERR-AUTH") {
                    alert("로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.");
                    navigate("/login");
                    return;
                }
                if (error.code === "ERR-IVD-VALUE") {
                    alert("올바르지 않은 발행 기록입니다.");
                    return;
                }
                if (error.code === "ERR-NOT-DECIDED") {
                    alert("아직 결정되지 않은 발행 기록입니다.");
                    return;
                }
                alert(error.message ?? "쿠폰 명단을 내보내는 중 오류가 발생했습니다.");
            },
        });
    };

    const handleCouponDownload = () => {
        if (!issueId) return;

        const numericIssueId = Number(issueId);
        if (Number.isNaN(numericIssueId)) return;

        exportImage(numericIssueId, {
            onSuccess: (data) => {
                window.open(data.url, "_blank");
            },
            onError: (error: ApiError) => {
                if (error.code === "ERR-AUTH") {
                    alert("로그인이 올바르지 않습니다. 다시 로그인해주세요.");
                    navigate("/login");
                    return;
                }
                if (error.code === "ERR-IVD-VALUE") {
                    alert("올바르지 않은 발행 기록입니다.");
                    return;
                }
                if (error.code === "ERR-NOT-DECIDED") {
                    alert("아직 결정되지 않은 발행 기록입니다.");
                    return;
                }
                alert(error.message ?? "지류 쿠폰을 내보내는 중 오류가 발생했습니다.");
            },
        });
    }


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
                    onClick={handleListDownload}
                > 전체명단 </Button>
                <Button
                    mode="blue_line"
                    icon={"coupon"}
                    iconPosition='left'
                    onClick={handleCouponDownload}
                > 등록용 지류쿠폰 </Button>
            </div>
        </div>
    );
}
