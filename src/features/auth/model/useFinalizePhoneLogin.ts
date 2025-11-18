import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
    finalizePhoneLoginApi,
    type FinalizePhoneLoginResponse,
} from "../api/finalizePhoneLogin";
import type {ApiError} from "../../../shared/types/api.ts";

export function useFinalizePhoneLogin(
    options?: UseMutationOptions<
        FinalizePhoneLoginResponse,
        ApiError,
        string
    >
) {
    return useMutation<FinalizePhoneLoginResponse, ApiError, string>({
        mutationFn: (phoneAuthToken: string) =>
            finalizePhoneLoginApi(phoneAuthToken),
        ...options,
    });
}
