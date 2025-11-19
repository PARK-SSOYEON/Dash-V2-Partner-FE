import React, {useState, useCallback} from 'react';
import {QRScanner} from "./QRScanner.tsx";
import {Icon} from "../../../shared/ui/Icon.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";

interface ProductData {
    couponId: number;
    productName: string;
    partnerName: string;
    expiredAt: string;
}

type Step = 'SCAN' | 'COMPLETE';

const mockProduct: ProductData = {
    couponId: 1,
    productName: '오리지널 타코야끼',
    partnerName: '호시 타코야끼',
    expiredAt: '2025.11.17. 15:25:30'
};

export const QRScanCard: React.FC = () => {
    const [step, setStep] = useState<Step>('SCAN');
    const [product, setProduct] = useState<ProductData | null>(null);

    React.useEffect(() => {
        if (step === 'COMPLETE') {
            const timer = setTimeout(() => {
                setStep('SCAN');
                setProduct(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const qrScannerId = 'reader';

    const handleScanSuccess = useCallback((decodedText: string) => {
        console.log("QR Code Scanned:", decodedText);
        // 실제 로직: decodedText (QR 값)를 서버에 보내 상품 정보를 가져옵니다.

        setProduct(mockProduct);
    }, []);

    const handleUse= () => {
        setStep('COMPLETE');
}

    const scanContent = (
        <div className="flex flex-col w-full items-center justify-center h-full p-6 text-center">
            <QRScanner onScanSuccess={handleScanSuccess} scannerId={qrScannerId}/>

            <div className="flex flex-col w-full mt-6 p-4 justify-start text-left">
                <p className="font-bold text-lg text-black">{product?.productName || "상품명 인식중..."}</p>
                <p className="font-medium text-base text-black/60">{product?.partnerName || "파트너명 인식중..."}</p>
                <p className="font-medium text-base text-black/60">{product?.expiredAt ? `유효 기간 ~${mockProduct.expiredAt}` : "유효기간 인식중..."}</p>
            </div>

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
            className={"flex flex-col gap-4 w-full min-h-[calc(100vh-var(--header-h,68px)-var(--bottom-nav-h,66px)-200px)]"}>
            <div
                className={"flex flex-1 flex-col pt-4 w-full h-full gap-4 rounded-3xl " +
                    "bg-white/80 backdrop-blur shadow-[0_0_4px_rgba(0,0,0,0.2)] items-center justify-center"}>
                {renderContent()}
            </div>

            {(product && step === 'SCAN') &&
                <div className={"flex w-full col-row"}>
                    <Button
                        mode="mono"
                        icon={"leftChevron"}
                        iconPosition={"left"}
                        onClick={()=>setProduct(null)}> 이전 </Button>
                    <Button
                        mode="color_fill"
                        icon={"leftChevron"}
                        iconPosition={"right"}
                        onClick={handleUse}> 쿠폰 사용 </Button>
                </div>}
        </div>

    );
};
