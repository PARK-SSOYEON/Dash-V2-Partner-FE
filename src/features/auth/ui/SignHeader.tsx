import {cn} from "../../../shared/lib/cn.ts";
import * as React from "react";

export function SignHeader({finalMode = false}) {
    const [topVisible, setTopVisible] = React.useState(!!top);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTopVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={cn("relative overflow-hidden mt-32 transition-all duration-700", topVisible ? "h-80" : "h-32")}>
            {/* 첫 번째 문구 */}
            <div
                className={cn(
                    "absolute inset-0 flex flex-col transition-all duration-700 ease-in-out text-4xl font-bold gap-2",
                    topVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                )}
            >
                    <span className="flew flew-row items-center">
                        <span className={"text-(--color-blue-500) "}>D:ASH</span>
                        <span className={"text-black "}>에서 만나</span>
                    </span>
                <span className={"text-black "}>반가워요 =)</span>
            </div>

            {/* 두 번째 문구 */}
            <div
                className={cn(
                    "absolute inset-0 flex flex-col text-3xl font-medium gap-2 text-black transition-all duration-700 ease-in-out",
                    topVisible ? "translate-y-40" : "translate-y-0",
                    finalMode ? "opacity-0 " : "opacity-100 "
                )}
            >
                <span>원활한 이용을 위해</span>
                <span>3가지 질문에</span>
                <span>답해주세요</span>
            </div>

            {/* 세 번째 문구 */}
            <div
                className={cn(
                    "absolute inset-0 flex flex-col text-3xl font-medium gap-2 text-black transition-all duration-700 ease-in-out",
                    finalMode? "opacity-100 " : "opacity-0"
                )}
            >
                <span>감사합니다!</span>
                <span>곧 서비스 홈으로</span>
                <span>이동할게요</span>
            </div>
        </div>
    )
}
