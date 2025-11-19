import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/types/api.ts";
import {changePin, type ChangePinResponse} from "../api/changePin.ts";

interface ChangePinVars {
    prevPin: string;
    newPin: string;
}

export function useChangePin(
    options?: UseMutationOptions<ChangePinResponse, ApiError, ChangePinVars>
) {
    return useMutation<ChangePinResponse, ApiError, ChangePinVars>({
        mutationFn: ({ prevPin, newPin }) => changePin(prevPin, newPin),
        ...options,
    });
}
