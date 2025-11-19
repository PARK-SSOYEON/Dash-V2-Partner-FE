import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
    finalizePinLoginApi, type FinalizePinLoginBody,
    type FinalizePinLoginResponse,
} from "../api/finalizePinLogin.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export function useFinalizePinLogin(
    options?: UseMutationOptions<
        FinalizePinLoginResponse,
        ApiError,
        FinalizePinLoginBody
    >
) {
    return useMutation<FinalizePinLoginResponse, ApiError, FinalizePinLoginBody>({
        mutationFn: (body: FinalizePinLoginBody) =>
            finalizePinLoginApi(body),
        ...options,
    });
}
