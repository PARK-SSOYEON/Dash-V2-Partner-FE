import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface DeleteIssuesBody {
    issues: number[]; // requestId 리스트
}

export async function deleteIssues(body: DeleteIssuesBody): Promise<void> {
    try {
        await apiClient.delete("/issues", {
            data: body,
            requireAuth: true,
        });
    } catch (err: any) {
        const status = err?.response?.status;
        const code = err?.response?.data?.code;

        if (status === 403 && code === "ERR-NOT-YOURS") {
            throw {
                message: "삭제할 수 없는 이슈가 포함되어 있습니다.",
                code,
            } as ApiError;
        }

        if (status === 401) {
            throw {
                message: "로그인 정보가 만료되었습니다.",
                code: "ERR-AUTH",
            } as ApiError;
        }

        throw {
            message: "이슈 삭제 중 오류가 발생했습니다.",
            code: "ERR-UNKNOWN",
        } as ApiError;
    }
}
