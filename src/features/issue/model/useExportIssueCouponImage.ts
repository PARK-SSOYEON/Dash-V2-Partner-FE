import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {exportIssueCouponImage, type ExportIssueCouponImageResponse} from "../api/exportIssueCouponImage.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export function useExportIssueCouponImage(
    options?: UseMutationOptions<ExportIssueCouponImageResponse, ApiError, number>
) {
    return useMutation<ExportIssueCouponImageResponse, ApiError, number>({
        mutationFn: (issueId: number) => exportIssueCouponImage(issueId),
        ...options,
    });
}
