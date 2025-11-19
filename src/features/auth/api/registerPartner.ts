import axios from "axios";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {hashPin} from "../lib/hashPin.ts";

export interface RegisterPartnerBody {
    phoneAuthToken: string;
    userName: string;
    partnerName: string;
    pin: string;
}

export interface RegisterPartnerResponse {
    accessToken: string;
}

/**
 * 회원가입 API
 * body: {
 *      phoneAuthToken: string
 *      userName: string
 *      partnerName: string (YYYY-MM-DD)
 *      pin: string[]
 *         }
 * 성공 시 accessToken
 */
export async function registerPartner(body: RegisterPartnerBody): Promise<RegisterPartnerResponse> {
    try {
        const hashedBody = {
            ...body,
            pin: hashPin(body.pin),
        };
        const res = await apiClient.post<RegisterPartnerResponse>("/auth/join/partner", hashedBody);
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
