import type { IssueStatusCode } from "./issueStatusType.ts";

export interface IssueSummary {
    requestId: number;
    title: string;
    productKindCount: number;
    status: IssueStatusCode;
}

export interface IssueListResponse {
    items: IssueSummary[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export type ProductSuggestion = {
    productId: number;
    name: string;
};
