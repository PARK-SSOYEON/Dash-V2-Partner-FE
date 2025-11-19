import { useQuery } from "@tanstack/react-query";
import {getIssueCoupons, type IssueCouponsResponse} from "../api/getIssueCoupons.ts";
import type {ApiError} from "../../../shared/types/api.ts";

/**
 * issueId와 enabled 조건에 따라 쿠폰/반려 정보 조회
 * - tap === "쿠폰내역" 또는 "반려정보" 일 때만 enabled 를 true 로 넘기면 됨
 */
export function useIssueCoupons(issueId?: number, enabled: boolean = true) {
    return useQuery<IssueCouponsResponse, ApiError>({
        queryKey: ["issueCoupons", issueId],
        queryFn: () => {
            if (!issueId) {
                throw new Error("issueId가 없습니다.");
            }
            return getIssueCoupons(issueId);
        },
        enabled: !!issueId && enabled,
    });
}
