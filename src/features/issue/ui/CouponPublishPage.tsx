import {useUIStore} from "../../../shared/store/uiStore.ts";
import * as React from "react";
import {useState} from "react";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import { type IssueItem } from "../../../shared/ui/MenuInput.tsx";
import { MenuInputWithSearch } from "./MenuInputWithSearch.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {DetailBox, type DetailItem} from "../../../shared/ui/DetailBox.tsx";
import {formatDate} from "../lib/formDate.ts";
import type {IssueRequestDetailResponse} from "../api/getIssueRequestDetail.ts";
import type {Product} from "../model/productType.ts";
import {useApproveIssue} from "../model/useApproveIssue.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {useCreateSelfIssue} from "../model/useCreateSelfIssue.ts";

const mapProductsToIssueItems = (products: Product[]): IssueItem[] =>
    products.map((p) => ({
        rowId: crypto.randomUUID(),
        productId: p.productId,
        isNew: p.isNew,
        name: p.productName ?? "",
        qty: p.count,
    }));

const mapIssueItemsToProducts = (items: IssueItem[]): Product[] => {
    return items.map((item) => ({
        isNew: item.isNew,
        productId: item.isNew ? undefined : item.productId,
        productName: item.name,
        count: item.qty,
    }));
};


type PublishLocationState =
    | {
    isOwner: true; //작성자가 본인
    issue?: undefined;
} | {
    isOwner: false;
    issue: IssueRequestDetailResponse;
};

export function CouponPublishPage() {
    const navigate = useNavigate();
    const showBottomMenu = useUIStore((s) => s.showBottomMenu);
    const { issueId } = useParams<{ issueId: string }>();
    const numericIssueId = issueId ? Number(issueId) : 0;

    const location = useLocation();
    const state = location.state as PublishLocationState | undefined;

    const isOwner = state?.isOwner ?? true;
    const issue = state && "issue" in state ? state.issue : undefined;
    const partnerId = issue?.partner?.partnerId ? String(issue.partner.partnerId) : "";

    const { mutate: approveIssue } = useApproveIssue();
    const { mutate: createSelfIssueMutate } = useCreateSelfIssue();

    const [summary, setSummary] = useState("");
    const [createdAtText] = useState(() => formatDate(new Date()));

    // 발행 품목 및 수량 (부모에서 내려준 기본 메뉴 사용)
    const [items, setItems] = React.useState<IssueItem[]>(
        isOwner ? [] : issue?.products ? mapProductsToIssueItems(issue.products) : []
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
                    value: issue.vendor.memberName ?? "-",
                },
                {
                    id: "phone",
                    label: "연락처",
                    value: issue.vendor.number ?? "-",
                },
                {
                    id: "date",
                    label: "요청일시",
                    value: issue.requestedAt,
                },
            ]
            : [];

    const handleSubmit = () => {
        if (!numericIssueId) return;

        if (items.length === 0) {
            alert("발행할 상품이 없습니다.");
            return;
        }

        // 기본 검증: 기존 상품(isNew=false)은 productId가 반드시 있어야 함
        for (const item of items) {
            if (!item.isNew && (item.productId == null || Number.isNaN(item.productId))) {
                alert("기존 상품을 선택한 경우 상품을 다시 선택해주세요.");
                return;
            }
            if (item.isNew && !item.name.trim()) {
                alert("신규 상품은 이름을 입력해야 합니다.");
                return;
            }
            if (item.qty <= 0) {
                alert("수량은 1개 이상이어야 합니다.");
                return;
            }
        }

        const mappedProducts: Product[] = mapIssueItemsToProducts(items);

        approveIssue(
            {
                issueId: numericIssueId,
                isApproved: true,
                products: mappedProducts,
            },
            {
                onSuccess: () => {
                    alert("발행이 완료되었습니다.");
                    navigate(`/issue/${numericIssueId}`, { replace: true });
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
                        alert(error.message ?? "발행 처리 중 오류가 발생했습니다.");
                    }
                },
            }
        );
    };

   const handleCreate = () => {
        const trimmedTitle = summary.trim();

        if (!trimmedTitle) {
            alert("발행 적요를 입력해주세요.");
            return;
        }

        if (items.length === 0) {
            alert("발행할 상품이 없습니다.");
            return;
        }

        // 기본 검증: 기존 상품(isNew=false)은 productId가 반드시 있어야 함
        for (const item of items) {
            if (!item.isNew && (item.productId == null || Number.isNaN(item.productId))) {
                alert("기존 상품을 선택한 경우 상품을 다시 선택해주세요.");
                return;
            }
            if (item.isNew && !item.name.trim()) {
                alert("신규 상품은 이름을 입력해야 합니다.");
                return;
            }
            if (item.qty <= 0) {
                alert("수량은 1개 이상이어야 합니다.");
                return;
            }
        }

        const mappedProducts: Product[] = mapIssueItemsToProducts(items);

        createSelfIssueMutate(
            {
                title: trimmedTitle,
                products: mappedProducts,
            },
            {
                onSuccess: () => {
                    alert("쿠폰이 발행되었습니다.");
                    navigate("/issue", { replace: true });
                },
                onError: (error: ApiError) => {
                    if (error.code === "ERR-AUTH") {
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        navigate("/login");
                    } else if (error.code === "ERR-IVD-VALUE") {
                        alert("올바르지 않은 발행 요청입니다.");
                    } else if (error.code === "ERR-ALREADY-DECIDED") {
                        alert("이미 결정된 발행입니다.");
                    } else {
                        alert(error.message ?? "쿠폰 발행 중 오류가 발생했습니다.");
                    }
                },
            }
        );
    }

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
                <MenuInputWithSearch
                    partnerId={partnerId}
                    items={items}
                    onChange={setItems}
                    onDelete={(id) =>
                        setItems((prev) => prev.filter((x) => x.rowId !== id))
                    }
                    onAdd={() =>
                        setItems((prev) => [
                            ...prev,
                            {
                                rowId: crypto.randomUUID(),
                                productId: undefined,
                                isNew: true,
                                name: "",
                                qty: 0,
                            },
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
                    <Button mode="blue_line" onClick={isOwner? handleCreate :handleSubmit}>
                        쿠폰 발행
                    </Button>
                </div>
            </div>
        </div>
    );
}
