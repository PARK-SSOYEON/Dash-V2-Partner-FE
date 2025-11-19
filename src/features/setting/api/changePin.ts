import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient.ts";
import type { ApiError } from "../../../shared/types/api.ts";
import {hashPin} from "../../auth/lib/hashPin.ts";

export interface ChangePinResponse {
    accessToken: string;
}

export async function changePin(
    prevPin: string,
    newPin: string
): Promise<ChangePinResponse> {
    try {
        const res = await apiClient.post<ChangePinResponse>(
            "/users/pin",
            {
                prevPin: hashPin(prevPin),
                newPin: hashPin(newPin),
            },
            {
                requireAuth: true,
            }
        );

        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const data = err.response?.data as ApiError | undefined;

            // 로그인 올바르지 않음
            if (status === 401 && !data?.code) {
                throw {
                    message: "로그인 정보가 올바르지 않습니다.",
                    code: "ERR-AUTH",
                } as ApiError;
            }

            // 잘못된 PIN
            if (status === 401 && data?.code === "ERR-IVD-VALUE") {
                throw {
                    message: "현재 PIN이 일치하지 않습니다.",
                    code: data.code,
                } as ApiError;
            }

            // 그 외 4xx
            throw {
                message: data?.message ?? "PIN 변경 중 오류가 발생했습니다.",
                code: data?.code,
            } as ApiError;
        }

        throw {
            message: "PIN 변경 중 알 수 없는 오류가 발생했습니다.",
        } as ApiError;
    }
}
