import { useQuery } from "@tanstack/react-query";
import {getIssueRequestDetail, type IssueRequestDetailResponse} from "../api/getIssueRequestDetail.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export function useIssueRequestDetail(
    issueId?: number,
    enabled: boolean = true
) {
    return useQuery<IssueRequestDetailResponse, ApiError>({
        queryKey: ["issueRequestDetail", issueId],
        queryFn: () => {
            if (!issueId) {
                throw new Error("issueId가 없습니다.");
            }
            return getIssueRequestDetail(issueId);
        },
        enabled: !!issueId && enabled,
    });
}
