import axios from "axios";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface VerifyPhoneCodeResponse {
    phoneAuthToken: string;
}

/**
 * 인증번호 검증 API
 * body: { code: string }
 * 성공 시 phoneAuthToken 반환
 */
export async function verifyPhoneCode(
    code: string
): Promise<VerifyPhoneCodeResponse> {
    try {
        const res = await apiClient.post<VerifyPhoneCodeResponse>(
            "/auth/phone",
            { code }
        );
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const data = err.response?.data as ApiError | undefined;

            const apiError: ApiError = {
                message: data?.message ?? "인증번호 확인에 실패했습니다.",
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
