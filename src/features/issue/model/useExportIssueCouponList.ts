import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {exportIssueCouponList, type ExportIssueCouponListResponse} from "../api/exportIssueCouponList.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export function useExportIssueCouponList(
    options?: UseMutationOptions<ExportIssueCouponListResponse, ApiError, number>
) {
    return useMutation<ExportIssueCouponListResponse, ApiError, number>({
        mutationFn: (issueId: number) => exportIssueCouponList(issueId),
        ...options,
    });
}
