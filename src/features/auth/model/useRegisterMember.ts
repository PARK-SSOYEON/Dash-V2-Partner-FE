import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { registerMember, type RegisterMemberBody, type RegisterMemberResponse } from "../api/registerMember";
import type {ApiError} from "../../../shared/types/api.ts";

export function useRegisterMember(
    options?: UseMutationOptions<RegisterMemberResponse, ApiError, RegisterMemberBody>
) {
    return useMutation<RegisterMemberResponse, ApiError, RegisterMemberBody>({
        mutationFn: (body: RegisterMemberBody) => registerMember(body),
        ...options,
    });
}
