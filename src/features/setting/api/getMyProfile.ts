import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export interface MyProfileResponse {
    partnerId: number;
    partnerName: string;
    numbers: string[];
    createdAt: string; // "YYYY-MM-DD HH:MM:SS"
}

export async function getMyProfile(): Promise<MyProfileResponse> {
    try {
        const res = await apiClient.get<MyProfileResponse>("/users/my", {
            requireAuth: true,
        });
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 401) {
                throw {
                    message: "로그인 정보가 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }

            throw {
                message: err.response?.data?.message ?? "사용자 정보를 불러오지 못했습니다.",
                code: err.response?.data?.code,
            } as ApiError;
        }

        throw {
            message: "알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
