import axios from "axios";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface RegisterMemberBody {
    phoneAuthToken: string;
    memberName: string;
    memberBirth: string; // "YYYY-MM-DD"
    departAt: string[];
}

export interface RegisterMemberResponse {
    accessToken: string;
}

/**
 * 회원가입 API
 * body: {
 *      phoneAuthToken: string
 *      memberName: string
 *      memberBirth: string (YYYY-MM-DD)
 *      departAt: string[]
 *         }
 * 성공 시 accessToken
 */
export async function registerMember(body: RegisterMemberBody): Promise<RegisterMemberResponse> {
    try {
        const res = await apiClient.post<RegisterMemberResponse>("/auth/join/member", body);
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const data = err.response?.data as ApiError | undefined;

            const apiError: ApiError = {
                message: data?.message ?? "회원가입에 실패했습니다.",
                code: data?.code,
            };
            throw apiError;
        }

        throw {
            message: "알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
