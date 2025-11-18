import {CouponRequestBlock} from "../../../shared/ui/CouponRequestBlock.tsx";
import * as React from "react";
import {useLocation} from "react-router-dom";

type Profile = {
    name: string;
    phone: string;
    affiliation: string[];
};

const sampleData: Profile = {
    name: "ㅁㅁㅁ님",
    phone: "010-1234-1234",
    affiliation: ["아주대학교", "소프트웨어융합대학", "사이버보안학과"]
}

export function SettingLayout({children}: { children?: React.ReactNode }) {

    const location = useLocation();
    const highlightArea = location.pathname.includes("phone")
        ? "subtitle"
        : location.pathname.includes("affiliation")
            ? "detail"
            : undefined;

    return (
        <div className="flex flex-col pt-4 w-full gap-4 min-h-[calc(100vh-var(--bottom-nav-h,66px)-40px)]">
            <header className="flex items-center justify-between h-17">
                <h1 className="text-3xl font-bold tracking-tight text-black">
                    설정
                </h1>
            </header>

            <CouponRequestBlock
                mode="view"
                title={sampleData.name}
                subtitle={sampleData.phone}
                subtitle2={"개인회원"}
                detailText={sampleData.affiliation.join("    ")}
                statusLabel={""}
                highlightArea={highlightArea}
                showStatus={false}
            />

            {children}
        </div>
    )
}
