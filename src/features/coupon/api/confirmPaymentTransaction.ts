import axios from "axios";
import { apiClient } from "../../../shared/lib/apiClient";
import type { ApiError } from "../../../shared/types/api";

export async function confirmPaymentTransaction(code: string): Promise<void> {
    try {
        await apiClient.post(
            "/payments/transaction/confirm",
            { code },
            { requireAuth: true }
        );
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 401) {
                throw {
                    message: "로그인이 필요합니다.",
                    code: "ERR-AUTH",
                } satisfies ApiError;
            }

            if (status === 406) {
                throw {
                    message: "이미 사용된 쿠폰입니다.",
                    code: "ERR-ALREADY-USED",
                } satisfies ApiError;
            }

            if (status === 400) {
                throw {
                    message: "올바르지 않은 결제코드입니다.",
                    code: err.response?.data?.code ?? "ERR-IVD-VALUE",
                } satisfies ApiError;
            }
        }

        throw {
            message: "결제 확정 처리 중 오류가 발생했습니다.",
        } satisfies ApiError;
    }
}
