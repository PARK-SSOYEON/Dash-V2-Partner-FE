import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { loginByPhone, type LoginByPhoneResponse } from "../api/loginByPhone";
import type {ApiError} from "../../../shared/types/api.ts";

export function useLoginByPhone(
    options?: UseMutationOptions<LoginByPhoneResponse, ApiError, string>
) {
    return useMutation<LoginByPhoneResponse, ApiError, string>({
        mutationFn: (phone: string) => loginByPhone(phone),
        ...options,
    });
}
