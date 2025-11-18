// shared/lib/apiClient.ts
import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ENV } from "../config/env";
import {useAuthStore} from "../store/authStore.ts";

declare module "axios" {
    export interface AxiosRequestConfig {
        requireAuth?: boolean;
    }

    export interface InternalAxiosRequestConfig {
        requireAuth?: boolean;
    }
}

// refresh 요청 한 번만 돌리게 하기 위한 상태
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// 토큰 재발급
async function refreshAccessToken(): Promise<string | null> {
    try {
        const res = await axios.post<{ accessToken: string }>(
            `${ENV.APP_API_URL}/auth/login/phone`,
            {},
            {
                withCredentials: true, // HttpOnly 쿠키 보내기
            }
        );

        const newToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        return newToken;
    } catch (e) {
        useAuthStore.getState().clearAuth();
        return null;
    }
}


// axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
    baseURL: ENV.APP_API_URL,
    withCredentials: true,
    timeout: 10000,
});

// 요청 인터셉터: requireAuth === true 일 때만 Bearer 토큰 붙이기
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (!config.requireAuth) {
            return config;
        }

        let token = useAuthStore.getState().accessToken;

        // accessToken이 없으면 먼저 refresh 시도
        if (!token) {
            try {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = refreshAccessToken().finally(() => {
                        isRefreshing = false;
                    });
                }

                token = await refreshPromise;
            } catch {
                token = null;
            }
        }

        // refresh 후에도 토큰이 없으면 Authorization 없이 진행 (서버에서 401을 줄 수 있음)
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 이면서 auth 요청이면 refresh 후 한 번 재시도
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalConfig = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // 원래 요청이 없거나 / 이미 한 번 retry 했으면 그대로 실패
        if (!originalConfig || originalConfig._retry) {
            return Promise.reject(error);
        }

        // 401 이고, auth 필요한 요청이었을 때만 refresh 로직 시도
        if (error.response?.status === 401 && originalConfig.requireAuth) {
            originalConfig._retry = true;

            try {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = refreshAccessToken().finally(() => {
                        isRefreshing = false;
                    });
                }

                const newAccessToken = await refreshPromise;

                if (!newAccessToken) {
                    logoutAndRedirectToLogin();
                    return Promise.reject(error);
                }

                // 새 토큰으로 Authorization 헤더 갱신 후 재요청
                originalConfig.headers = originalConfig.headers ?? {};
                originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;

                return apiClient(originalConfig);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const logoutAndRedirectToLogin = () => {
    // 1) 토큰/인증 상태 초기화
    useAuthStore.getState().clearAuth();

    // 2) 로그인 페이지로 이동
    window.location.href = "/login";
};
