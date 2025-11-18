import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../shared/store/authStore.ts";
import React from "react";

export function PublicRoute({ children }: { children: React.ReactNode }) {
    const accessToken = useAuthStore((s) => s.accessToken);

    if (accessToken) {
        return <Navigate to="/coupon" replace />;
    }

    return children;
}
