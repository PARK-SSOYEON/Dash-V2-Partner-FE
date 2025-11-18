import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
    verifyPhoneCode,
    type VerifyPhoneCodeResponse,
} from "../api/verifyPhoneCode";
import type {ApiError} from "../../../shared/types/api.ts";

export function useVerifyPhoneCode(
    options?: UseMutationOptions<VerifyPhoneCodeResponse, ApiError, string>
) {
    return useMutation<VerifyPhoneCodeResponse, ApiError, string>({
        mutationFn: (code: string) => verifyPhoneCode(code),
        ...options,
    });
}
