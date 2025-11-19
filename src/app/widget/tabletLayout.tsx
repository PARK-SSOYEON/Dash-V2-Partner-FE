import * as React from "react";

type Props = { children: React.ReactNode };

export default function TabletLayout({children}: Props) {
    return (
        <div
            className="mx-auto bg-white"
            style={{
                // 좌우 가터(브레이크포인트별 조정 가능)
                ["--gutter" as any]: "3rem",
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
                    paddingBottom: "calc(env(safe-area-inset-bottom) + var(--bottom-nav-h,66px) + var(--gutter,24px))",
                }}
            >
                {children}
            </main>
        </div>
    );
}
