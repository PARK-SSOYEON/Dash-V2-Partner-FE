import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface IssueProductExisting {
    isNew: false;
    productId?: number;
    count: number;
}

export interface IssueProductNew {
    isNew: true;
    productName?: string;
    count: number;
}

export type IssueProductInput = IssueProductExisting | IssueProductNew;

export interface DecideIssueCouponsBody {
    issueId: number;
    isApproved: boolean;
    // isApproved: true일 때만 사용
    products?: IssueProductInput[];
    // isApproved: false일 때만 사용
    reason?: string;
}

export async function decideIssueCoupons(
    body: DecideIssueCouponsBody
): Promise<void> {
    try {
        await apiClient.post("/issues/coupons", body, {
            requireAuth: true,
        });
    } catch (err: any) {
        const status: number | undefined = err?.response?.status;
        const data = err?.response?.data as ApiError | undefined;

        if (status === 401) {
            throw {
                message: "로그인 정보가 올바르지 않습니다.",
                code: "ERR-AUTH",
            } as ApiError;
        }

        if (status === 400 && data?.code === "ERR-IVD-VALUE") {
            throw {
                message: "올바르지 않은 발행 기록입니다.",
                code: data.code,
            } as ApiError;
        }

        if (status === 406) {
            throw {
                message: "이미 결정된 발행 기록입니다.",
                code: "ERR-ALREADY-DECIDED",
            } as ApiError;
        }

        throw {
            message: "발행 요청 처리 중 오류가 발생했습니다.",
            code: data?.code,
        } as ApiError;
    }
}
