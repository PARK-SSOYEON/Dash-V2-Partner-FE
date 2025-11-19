import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type {ApiError} from "../../../shared/types/api.ts";
import {createSelfIssue, type CreateSelfIssueBody} from "../api/createSelfIssue.ts";

export function useCreateSelfIssue(
    options?: UseMutationOptions<void, ApiError, CreateSelfIssueBody>
) {
    return useMutation<void, ApiError, CreateSelfIssueBody>({
        mutationFn: (body: CreateSelfIssueBody) => createSelfIssue(body),
        ...options,
    });
}
