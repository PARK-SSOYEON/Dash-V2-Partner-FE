import * as React from "react";

type Props = { children: React.ReactNode };

export default function Layout({children}: Props) {
    return (
        <div
            className="mx-auto bg-(--color-gray-50)"
            style={{
                // 앱 전체 최대 폭(디자인 기준 가로 폭)
                ["--container-max" as any]: "450px",
                // 좌우 가터(브레이크포인트별 조정 가능)
                ["--gutter" as any]: "1.5rem",
                // 하단 네비게이션 바 높이(아이콘 24px 기준 52~56px 권장)
                ["--bottom-nav-h" as any]: "66px",
                width: "100%",
                maxWidth: "var(--container-max)",
            }}
        >
            <main
                style={{
                    minHeight: "100vh",
                    paddingInline: "var(--gutter)",
                    WebkitOverflowScrolling: "touch",
                    paddingBottom: "calc(env(safe-area-inset-bottom) + var(--bottom-nav-h,66px) + var(--gutter,24px) + 1rem)",
                }}
            >
                {children}
            </main>
        </div>
    );
}
