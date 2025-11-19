import { useMutation } from "@tanstack/react-query";
import {
    getPaymentTransaction,
    type PaymentTransactionResponse,
} from "../api/getPaymentTransaction";
import type { ApiError } from "../../../shared/types/api";

export function usePaymentTransaction() {
    return useMutation<PaymentTransactionResponse, ApiError, string>({
        mutationFn: (code: string) => getPaymentTransaction(code),
    });
}
