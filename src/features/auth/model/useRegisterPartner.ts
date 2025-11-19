import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { registerPartner, type RegisterPartnerBody, type RegisterPartnerResponse } from "../api/registerPartner.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export function useRegisterPartner(
    options?: UseMutationOptions<RegisterPartnerResponse, ApiError, RegisterPartnerBody>
) {
    return useMutation<RegisterPartnerResponse, ApiError, RegisterPartnerBody>({
        mutationFn: (body: RegisterPartnerBody) => registerPartner(body),
        ...options,
    });
}
