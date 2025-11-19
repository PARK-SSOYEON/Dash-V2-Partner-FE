import { useQuery } from "@tanstack/react-query";
import type {IssueListResponse} from "./types.ts";
import {getIssueList, type GetIssueListParams} from "../api/getIssueList.ts";


export function useIssueListQuery(filters: GetIssueListParams) {
    return useQuery<IssueListResponse>({
        queryKey: ["issues", filters],
        queryFn: () => getIssueList(filters),
    });
}
