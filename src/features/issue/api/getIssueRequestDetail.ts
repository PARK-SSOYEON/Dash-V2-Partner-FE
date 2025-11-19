import type {IssueStatusCode} from "../model/issueStatusType.ts";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import type {Product} from "../model/productType.ts";

export interface IssueRequestDetailResponse {
    issueId: number;
    title: string;
    status: IssueStatusCode;
    vendor: {
        memberId: number;
        memberName: string;
        number: string; // "010-1234-1234"
    };
    partner: {
        partnerId: number;
        partnerName: string;
        number: string; // 대표번호
    };
    products: Product[];
    requestedAt: string; // "YYYY.MM.DD HH:MM:SS"
}

export async function getIssueRequestDetail(
    issueId: number
): Promise<IssueRequestDetailResponse> {
    try {
        const res = await apiClient.get<IssueRequestDetailResponse>(
            `/issues/${issueId}/requests`,
            {
                requireAuth: true,
            }
        );
        return res.data;
    } catch (err: any) {
        const status = err?.response?.status;
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

        throw {
            message: "발행 요청서 정보를 불러오지 못했습니다.",
            code: data?.code,
        } as ApiError;
    }
}
