import React, {useState, useCallback} from 'react';
import {QRScanner} from "./QRScanner.tsx";
import {Icon} from "../../../shared/ui/Icon.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {useIsLandscape} from "../../../shared/hook/useIsLandscape.ts";
import {cn} from "../../../shared/lib/cn.ts";
import {usePaymentTransaction} from "../model/usePaymentTransaction.ts";
import {useNavigate} from "react-router-dom";
import {useConfirmPaymentTransaction} from "../model/useConfirmPaymentTransaction.ts";
import type {ApiError} from "../../../shared/types/api.ts";

interface ProductData {
    couponId: number;
    productName: string;
    partnerName: string;
    expiredAt: string;
}

type Step = 'SCAN' | 'COMPLETE';

export const QRScanCard: React.FC = () => {
    const [step, setStep] = useState<Step>('SCAN');
    const [product, setProduct] = useState<ProductData | null>(null);
    const [code, setCode] = useState<string | null>(null);

    const isLandscape = useIsLandscape();
    const [isError, setIsError] = useState(false);
    const paymentTx = usePaymentTransaction();
    const confirmTx = useConfirmPaymentTransaction();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (step === 'COMPLETE') {
            const timer = setTimeout(() => {
                setStep('SCAN');
                setProduct(null);
                setCode(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const qrScannerId = 'reader';

    const handleScanSuccess = useCallback((decodedText: string) => {
        console.log("QR Code Scanned:", decodedText);
        setCode(decodedText);
        setIsError(false);

        paymentTx.mutate(decodedText, {
            onSuccess: (data) => {
                setProduct({
                    couponId: data.couponId,
                    productName: data.productName,
                    partnerName: data.vendorName,
                    expiredAt: data.expiredAt,
                });
            },
            onError: () => {
                setProduct(null);
                setIsError(true);

                setTimeout(() => {
                    setIsError(false);
                }, 2000);
            }
        });
    }, []);

    const handleUse = () => {
        if (!product || !code) return;

        confirmTx.mutate(code, {
            onSuccess: () => {
                setStep('COMPLETE');
            },
            onError: (error: ApiError) => {
                if (error.code === "ERR-AUTH") {
                    alert("로그인이 필요합니다. 다시 로그인해주세요.");
                    navigate("/login");
                    return;
                }

                setIsError(true);

                setTimeout(() => {
                    setIsError(false);
                    setProduct(null);
                    setCode(null);
                    setStep("SCAN");
                }, 2000);
            },
        });
    };

    const scanContent = (
        <div className="flex flex-col w-full items-center justify-center h-full p-6 text-center">
            <QRScanner onScanSuccess={handleScanSuccess} scannerId={qrScannerId}/>

            <div className="flex flex-col w-full mt-6 p-4 justify-start text-left">
                <p className="font-bold text-lg text-black">{product?.productName || "상품명 인식중..."}</p>
                <p className="font-medium text-base text-black/60">{product?.partnerName || "파트너명 인식중..."}</p>
                <p className="font-medium text-base text-black/60">{product?.expiredAt ? `유효 기간 ~${product.expiredAt}` : "유효기간 인식중..."}</p>
            </div>

            {isError && ( //isError는 2초 지나면 다시 false
                <div className="flex flex-col w-full mt-6 p-4 justify-start text-left">
                    <p className="font-bold text-lg text-black">올바른 결제코드가 아니에요</p>
                    <p className="font-medium text-base text-black/60">결제코드를 확인 후 다시 인식해주세요</p>
                </div>
            )}

        </div>
    )

    const completeContent = (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center space-y-4">
            <Icon name={"check"} size={115}/>
            <span className="text-base font-medium text-(--color-blue-500)">쿠폰이 정상적으로<br/>결제되었습니다</span>
        </div>
    );

    // --- Render based on Step ---
    const renderContent = () => {
        switch (step) {
            case 'SCAN':
                return scanContent;
            case 'COMPLETE':
                return completeContent;
            default:
                return <div className="p-8">알 수 없는 단계입니다.</div>;
        }
    };

    return (
        <div
            className={cn("flex flex-col gap-4 w-full ",
                isLandscape ? "min-h-[calc(100vh-var(--header-h,68px)-150px)]" : "min-h-[calc(100vh-var(--header-h,68px)-var(--bottom-nav-h,66px)-200px)]"
            )}>
            <div
                className={"flex flex-1 flex-col pt-4 w-full h-full gap-4 rounded-3xl " +
                    "bg-white/80 backdrop-blur shadow-[0_0_4px_rgba(0,0,0,0.2)] items-center justify-center"}>
                {renderContent()}
            </div>

            {(product && step === 'SCAN') &&
                <div className={"flex w-full col-row gap-4"}>
                    <Button
                        mode="mono"
                        icon={"leftChevron"}
                        iconPosition={"left"}
                        onClick={() => setProduct(null)}> 이전 </Button>
                    <Button
                        mode="color_fill"
                        icon={"credit"}
                        iconPosition={"right"}
                        onClick={handleUse}> 쿠폰 사용 </Button>
                </div>}
        </div>
    );
};
