import * as React from "react";

export type HeaderStep = "default" | "otp";

const TEXTS: Record<
    HeaderStep,
    {
        top?: string;
        middle?: string;
        bottom?: string;
    }> = {
    "default": {top: "쿠폰관리,", middle: "이제 간단히"},
    "otp": {middle: "로그인을 위한", bottom: "인증번호 입력"},
};

const DASH_POSITION: Record<HeaderStep, "top" | "bottom"> = {
    "default": "bottom",
    "otp": "top",
};

export interface LoginHeaderProps {
    step: HeaderStep;
}

export function LoginHeader({ step }: LoginHeaderProps) {
    const {top, middle, bottom} = TEXTS[step];

    const [topText, setTopText] = React.useState(top);
    const [topVisible, setTopVisible] = React.useState(!!top);

    const [middleText, setMiddleText] = React.useState(middle);
    const [middleVisible, setMiddleVisible] = React.useState(true);

    const [bottomText, setBottomText] = React.useState(bottom);
    const [bottomVisible, setBottomVisible] = React.useState(!!bottom);

    const dashTop = DASH_POSITION[step] === "top" ? "16.6667%" : "83.3333%";

    React.useEffect(() => {
        if (middle === middleText) return;

        // 기존 텍스트 페이드아웃
        setMiddleVisible(false);

        const timeout = setTimeout(() => {
            // 페이드아웃 이후 페이드인
            setMiddleText(middle);
            setMiddleVisible(true);
        }, 350);

        return () => clearTimeout(timeout);
    }, [middle, middleText]);

    React.useEffect(() => {
        if (top === topText) return;

        if (!top && topText) {
            // 기존 텍스트 페이드아웃 후 제거
            setTopVisible(false);
            const timeout = setTimeout(() => {
                setTopText(top);
            }, 350);
            return () => clearTimeout(timeout);
        } else {
            // 텍스트가 새로 생길 때 바로 페이드 인
            setTopText(top);
            setTopVisible(!!top);
        }
    }, [top, topText]);

    React.useEffect(() => {
        if (bottom === bottomText) return;

        if (!bottom && bottomText) {
            setBottomVisible(false);
            const timeout = setTimeout(() => {
                setBottomText(bottom);
            }, 350);
            return () => clearTimeout(timeout);
        } else {
            setBottomText(bottom);
            setBottomVisible(!!bottom);
        }
    }, [bottom, bottomText]);

    return (
        <div className="relative grid grid-rows-3 h-48 overflow-hidden mt-32">
            {/* 위 줄 슬롯 */}
            <div className="flex items-center">
                <span
                    className={
                        "transition-opacity duration-700 ease-in-out text-4xl font-bold text-black " +
                        (topVisible ? "opacity-100" : "opacity-0")
                    }
                >
                  {topText ?? "\u00A0"}
                </span>
            </div>

            {/* 가운데 줄 슬롯 */}
            <div className="flex items-center">
                <span
                    className={
                        "transition-opacity duration-700 ease-in-out text-4xl font-bold text-black " +
                        (middleVisible ? "opacity-100" : "opacity-0")
                    }
                >
                  {middleText ?? "\u00A0"}
                </span>
            </div>

            {/* 아래 줄 슬롯 */}
            <div className="flex items-center">
                <span
                    className={
                        "transition-opacity duration-700 ease-in-out text-4xl font-bold text-black " +
                        (bottomVisible ? "opacity-100" : "opacity-0")
                    }
                >
                  {bottomText ?? "\u00A0"}
                </span>
            </div>

            {/* D:ASH */}
            <div
                className="pointer-events-none absolute flex items-center w-full left-1/2 text-4xl font-bold text-(--color-blue-500) transition-[top] duration-900 ease-in-out"
                style={{
                    top: dashTop,
                    transform: "translate(-50%, -50%)",
                }}
            >
                D:ASH
            </div>
        </div>
    );

}
