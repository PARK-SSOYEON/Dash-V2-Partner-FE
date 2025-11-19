import { useMutation } from "@tanstack/react-query";
import type {ApiError} from "../../../shared/types/api.ts";
import {confirmPaymentTransaction} from "../api/confirmPaymentTransaction.ts";

export function useConfirmPaymentTransaction() {
    return useMutation<void, ApiError, string>({
        mutationFn: (code: string) => confirmPaymentTransaction(code),
    });
}
