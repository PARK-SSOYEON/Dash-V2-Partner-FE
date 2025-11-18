import React, {useEffect, useState} from 'react';
import {Icon} from "../../../shared/ui/Icon.tsx";
import blurredQr from "../../../shared/assets/qrimg.png";
import type {CouponProduct} from "../../../entities/coupon/model/types.ts";
import {CouponInfo} from "../../../entities/coupon/ui/CouponInfo.tsx";

type Mode = 'DEFAULT' | 'EXPIRED' | 'USED';

interface CouponViewCardProps {
    mode?: Mode;
    product?: CouponProduct;
    selectable?: boolean;
    selected?: boolean;
    onToggleSelect?: (couponId: number) => void;
}

export const CouponViewCard: React.FC<CouponViewCardProps> = ({
                                                                  mode,
                                                                  product,
                                                                  selectable,
                                                                  selected,
                                                                  onToggleSelect,
                                                              }) => {
    const [remainingSeconds, setRemainingSeconds] = useState<number>(20);
    const [isActive, setIsActive] = useState<boolean>(false);

    const isSelected = !!selected;

    const handleRootClick = () => {
        if (!selectable || !product) return;
        onToggleSelect?.(product.couponId);
    };

    // remainingSeconds 값이 변경될 때마다 화면이 다시 렌더링되도록 보장
    useEffect(() => {
        if (!isActive) return;
        // state 업데이트는 이미 setInterval 안에서 일어나므로 여기서는 렌더 트리거 역할만 함
    }, [remainingSeconds]);

    // 활성화된 QR일 때 재인증 카운트다운
    useEffect(() => {
        if (!isActive) return;

        setRemainingSeconds(20);
        const timer = window.setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    window.clearInterval(timer);
                    setIsActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isActive]);

    const handleActivate = () => {
        if (selectable) return;
        setIsActive(true);
    };

    const defaultContent = (
        <div className="flex flex-col w-full items-center justify-center h-full p-6 text-center">
            {!isActive && (
                <button className="relative flex items-center justify-center w-60 h-60 rounded-2xl overflow-hidden"
                        onClick={handleActivate}
                >
                    <img
                        src={blurredQr}
                        alt="inactive qr"
                        className="w-full h-full object-contain bg-white"
                    />
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 text-black bg-white/60 backdrop-blur-sm">
                        {!isSelected && (
                            <>
                                <Icon name={"lock"} size={30}/>
                                <p className="mt-2 text-base font-medium">
                                    눌러서 잠금해제
                                </p>
                            </>
                        )}
                    </div>
                </button>
            )}

            {isActive && (
                <div className="flex flex-col items-center">
                    <div className="w-60 h-60 bg-black/30 rounded-2xl"/>
                    <p className="mt-3 text-[11px] text-black/70">
                        재인증까지{" "}
                        <span className="text-(--color-blue-500) font-semibold">
                        {remainingSeconds}
                    </span>{" "}
                        초 남음
                    </p>
                </div>
            )}

            <CouponInfo product={product} />
        </div>
    );

    const expiredContent = (
        <div className="flex flex-col w-full items-center justify-center h-full p-6 text-center">
            <div
                className="relative flex items-center justify-center w-60 h-60 bg-gray-100 rounded-2xl overflow-hidden">
                <img
                    src={blurredQr}
                    alt="expired qr"
                    className="w-full h-full object-contain bg-white"
                />
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 text-(--color-red-400) bg-white/60 backdrop-blur-sm">
                    {!isSelected && (
                        <>
                            <Icon name={"warning"} size={30}/>
                            <p className="mt-2 text-base font-medium">
                                쿠폰의 유효기간이 지나 <br/> 더 이상 이용할 수 없어요
                            </p>
                        </>
                    )}
                </div>
            </div>

            <CouponInfo product={product} />
        </div>
    );

    const usedCouponContent = (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center space-y-4">
            <Icon name={"check"} size={115}/>
            <span className="text-base font-medium text-(--color-blue-500)">쿠폰 사용이 완료됐어요!</span>
        </div>
    );

    const renderContent = () => {
        switch (mode) {
            case 'DEFAULT':
                return defaultContent;
            case 'EXPIRED':
                return expiredContent;
            case 'USED':
                return usedCouponContent;
            default:
                return <div className="p-8">알 수 없는 단계입니다.</div>;
        }
    };

    return (
        <div
            className={"flex flex-col gap-4 w-full min-h-[calc(100vh-var(--header-h,68px)-var(--bottom-nav-h,66px)-200px)]"}>
            <div
                onClick={handleRootClick}
                className={
                    "relative flex flex-1 flex-col pt-4 w-full h-full gap-4 rounded-3xl " +
                    "bg-white/80 backdrop-blur shadow-[0_0_4px_rgba(0,0,0,0.2)] items-center justify-center " +
                    (isSelected ? "border border-(--color-blue-500) bg-(--color-blue-500)/10" : "")
                }
            >
                {renderContent()}
                {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-(--color-blue-500)/10">
                        <div className="px-4 py-2 rounded-full bg-white/80 text-(--color-blue-500) font-medium text-2xl">
                            선택됨
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
