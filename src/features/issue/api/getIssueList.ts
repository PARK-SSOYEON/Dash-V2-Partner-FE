import type { IssueListResponse } from "../model/types";
import type { IssueStatusCode } from "../model/issueStatusType";
import {apiClient} from "../../../shared/lib/apiClient.ts";

export interface GetIssueListParams {
    status?: IssueStatusCode;
    title?: string;
    page?: number;
    size?: number;
}

export async function getIssueList(
    params: GetIssueListParams = {}
): Promise<IssueListResponse> {
    const res = await apiClient.get<IssueListResponse>("/issues", {
        params,
        requireAuth: true,
    });

    return res.data;
}
