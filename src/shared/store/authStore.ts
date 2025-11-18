import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
    accessToken: string | null;
    phoneAuthToken: string | null;
    setAccessToken: (token: string | null) => void;
    setPhoneAuthToken: (token: string | null) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            phoneAuthToken: null,
            setAccessToken: (token) => set({ accessToken: token }),
            setPhoneAuthToken: (token) => set({ phoneAuthToken: token }),
            clearAuth: () => set({ accessToken: null, phoneAuthToken: null }),
        }),
        {
            name: "auth", // localStorage key
        }
    )
);
