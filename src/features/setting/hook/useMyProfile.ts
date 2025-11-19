import { useQuery } from "@tanstack/react-query";
import {getMyProfile, type MyProfileResponse} from "../api/getMyProfile.ts";
import type { ApiError } from "../../../shared/types/api.ts";

export function useMyProfile() {
    return useQuery<MyProfileResponse, ApiError>({
        queryKey: ["myProfile"],
        queryFn: getMyProfile,
    });
}
