import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type {ApiError} from "../../../shared/types/api.ts";
import {deleteIssues, type DeleteIssuesBody} from "../api/deleteIssues.ts";

export function useDeleteIssuesMutation(
    options?: UseMutationOptions<void, ApiError, DeleteIssuesBody>
) {
    return useMutation<void, ApiError, DeleteIssuesBody>({
        mutationFn: (body) => deleteIssues(body),
        ...options,
    });
}
