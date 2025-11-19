import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type {ApiError} from "../../../shared/types/api.ts";
import {decideIssueCoupons, type DecideIssueCouponsBody} from "../api/decideIssueCoupons.ts";

export function useApproveIssue(
    options?: UseMutationOptions<void, ApiError, DecideIssueCouponsBody>
) {
    return useMutation<void, ApiError, DecideIssueCouponsBody>({
        mutationFn: (body) => decideIssueCoupons(body),
        ...options,
    });
}
