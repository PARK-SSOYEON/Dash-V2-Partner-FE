import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface ExportIssueCouponListResponse {
    url: string;
}

export async function exportIssueCouponList(
    issueId: number
): Promise<ExportIssueCouponListResponse> {
    try {
        const res = await apiClient.post<ExportIssueCouponListResponse>(
            `/issues/${issueId}/export/list`,
            {},
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
            throw {
                message: "아직 결정되지 않은 발행 기록입니다.",
                code: "ERR-NOT-DECIDED",
            } as ApiError;
        }

        throw {
            message: "쿠폰 명단을 내보내는 중 오류가 발생했습니다.",
            code: data?.code,
        } as ApiError;
    }
}
