import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface SelfIssueProduct {
    isNew: boolean;
    productId?: number;
    productName?: string;
    count: number;
}

export interface CreateSelfIssueBody {
    title: string;
    products?: SelfIssueProduct[];
}

export async function createSelfIssue(
    body: CreateSelfIssueBody
): Promise<void> {
    try {
        await apiClient.post("/issues/coupons/self", body, {
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
                message: "올바르지 않은 발행 요청입니다.",
                code: data.code,
            } as ApiError;
        }

        if (status === 406) {
            throw {
                message: "이미 결정된 발행입니다.",
                code: "ERR-ALREADY-DECIDED",
            } as ApiError;
        }

        throw {
            message: "쿠폰 발행 중 오류가 발생했습니다.",
            code: data?.code,
        } as ApiError;
    }
}
