import axios from "axios";
import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {hashPin} from "../lib/hashPin.ts";

export interface FinalizePinLoginResponse {
    accessToken: string;
    name?: string | null;
}

/**
 * pin으로 최종 로그인 처리 API
 * body: { pin: string }
 * 성공 시 accessToken
 */
export async function finalizePinLoginApi(
    pin: string
): Promise<FinalizePinLoginResponse> {
    try {
        const hashedPin = hashPin(pin);

        const res = await apiClient.post<FinalizePinLoginResponse>(
            "/auth/login/pin",
            { pin: hashedPin }
        );
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const data = err.response?.data as ApiError | undefined;
            const apiError: ApiError = {
                message: data?.message ?? "로그인 처리에 실패했습니다.",
                code: data?.code,
            };
            throw apiError;
        }

        throw {
            message: "알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
