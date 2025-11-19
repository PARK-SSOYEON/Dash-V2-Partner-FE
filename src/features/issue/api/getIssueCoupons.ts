import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import type {Product} from "../model/productType.ts";

export interface IssueCouponsApprovedInfo {
    requestedIssueCount: number;
    approvedIssueCount: number;
    validDays: number;
    vendor: {
        memberId: number;
        memberName: string;
        number: string;
    };
    partner: {
        partnerId: number;
        partnerName: string;
        number: string;
    };
    products: Product[];
    requestedAt: string; // "YYYY.MM.DD HH:MM:SS"
    decidedAt: string;
    expiredAt: string;
}

export interface IssueCouponsRejectedInfo {
    requestedIssueCount: number;
    reason: string;
    requestedAt: string;
    decidedAt: string;
}

export type IssueCouponsResponse =
    | {
    isApproved: true;
    issueInfo: IssueCouponsApprovedInfo;
}
    | {
    isApproved: false;
    rejectInfo: IssueCouponsRejectedInfo;
};

export async function getIssueCoupons(
    issueId: number
): Promise<IssueCouponsResponse> {
    try {
        const res = await apiClient.get<IssueCouponsResponse>(
            `/issues/${issueId}/coupons`,
            {
                requireAuth: true,
            }
        );
        return res.data;
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
            // 아직 승인/반려 결정이 안 된 상태
            throw {
                message: "아직 결정되지 않은 발행 기록입니다.",
                code: "ERR-NOT-DECIDED",
            } as ApiError;
        }

        throw {
            message: "쿠폰/반려 정보를 불러오지 못했습니다.",
            code: data?.code,
        } as ApiError;
    }
}
