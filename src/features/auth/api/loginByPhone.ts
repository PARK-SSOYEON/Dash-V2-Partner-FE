import axios from "axios";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface LoginByPhoneResponse {
    isUsed: boolean;
    userType: string | null; // "USER_TYPE/PERSONAL" | null 정도로 좁혀도 됨
}

/**
 * 전화번호로 로그인/회원여부 확인 API
 * body: { phone: string }
 * 성공하면 브라우저에 LOGIN-REQUEST-HASH 쿠키
 */
export async function loginByPhone(phone: string): Promise<LoginByPhoneResponse> {
    try {
        const res = await apiClient.post<LoginByPhoneResponse>(
            "/auth/phone/request",
            { phone }
        );
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const data = err.response?.data as ApiError | undefined;

            // { code: "ERR-IVD-PARAM" } or { code: "ERR-RETRY-EXCEED" }
            const apiError: ApiError = {
                message: data?.message ?? "로그인에 실패했습니다.",
                code: data?.code,
            };
            throw apiError;
        }

        const unknownError: ApiError = {
            message: "알 수 없는 오류가 발생했습니다.",
        };
        throw unknownError;
    }
}
