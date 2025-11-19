import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
    finalizePinLoginApi,
    type FinalizePinLoginResponse,
} from "../api/finalizePinLogin.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export function useFinalizePinLogin(
    options?: UseMutationOptions<
        FinalizePinLoginResponse,
        ApiError,
        string
    >
) {
    return useMutation<FinalizePinLoginResponse, ApiError, string>({
        mutationFn: (pin: string) =>
            finalizePinLoginApi(pin),
        ...options,
    });
}
