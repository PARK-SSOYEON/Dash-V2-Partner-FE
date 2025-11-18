// features/auth/model/useLoginByPhone.ts
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { loginByPhone, type LoginByPhoneResponse } from "../api/loginByPhone";
import type {ApiError} from "../../../shared/types/api.ts";

/**
 * 전화번호 로그인 Mutation 훅
 * - mutate(phone, { onSuccess, onError }) 형태로 사용
 * - 네비게이션/스텝 변경은 사용하는 컴포넌트(LoginForm)에서 처리
 */
export function useLoginByPhone(
    options?: UseMutationOptions<LoginByPhoneResponse, ApiError, string>
) {
    return useMutation<LoginByPhoneResponse, ApiError, string>({
        mutationFn: (phone: string) => loginByPhone(phone),
        ...options,
    });
}
