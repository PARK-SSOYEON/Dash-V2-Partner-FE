import React, {useState, useRef, useCallback} from 'react';
import {SignatureCanvasComponent, type SignatureCanvasRef} from "./SignatureCanvasComponent.tsx";
import {QRScanner} from "./QRScanner.tsx";
import {Icon} from "../../../shared/ui/Icon.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";

interface ProductData {
    couponId: number;
    productName: string;
    partnerName: string;
    expiredAt: string;
}

type Step = 'INSTRUCTION' | 'REGISTER' | 'COMPLETE';

const mockProduct: ProductData = {
    couponId: 1,
    productName: '오리지널 타코야끼',
    partnerName: '호시 타코야끼',
    expiredAt: '2025.11.17. 15:25:30'
};

export const CouponRegisterCard: React.FC = () => {
    const [step, setStep] = useState<Step>('INSTRUCTION');
    const [product, setProduct] = useState<ProductData | null>(null);
    const [signatureData, setSignatureData] = useState<string | null>(null);

    React.useEffect(() => {
        if (step === 'COMPLETE') {
            const timer = setTimeout(() => {
                setStep('INSTRUCTION');
                setProduct(null);
                setSignatureData(null);
                sigCanvas.current?.clear();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const sigCanvas = useRef<SignatureCanvasRef | null>(null);
    const qrScannerId = 'reader';

    // --- Step 1: INSTRUCTION ---
    const instructionContent = (
        <button className="flex flex-col items-center justify-center w-full h-full p-8 text-center space-y-4"
                onClick={() => setStep('REGISTER')}>
            <Icon name={"addCoupon"} size={103}/>
            <span className="text-base font-medium text-black/40">지류 교환권이나 등록코드가 있다면 <br/> 여기서 등록 후 사용할 수 있어요 </span>
        </button>
    );

    // --- Step 2: QR Scanning Logic ---
    const handleScanSuccess = useCallback((decodedText: string) => {
        console.log("QR Code Scanned:", decodedText);
        // 실제 로직: decodedText (QR 값)를 서버에 보내 상품 정보를 가져옵니다.

        setProduct(mockProduct);
    }, []);

    // 서명 지우기
    // const handleClear = () => {
    //     sigCanvas.current?.clear();
    //     setSignatureData(null);
    // };

    const handleRegister = () => {
        if (sigCanvas.current?.isEmpty()) {
            alert("서명을 먼저 해주세요.");
            console.log("서명을 먼저 해주세요.");
            return;
        }

        // 서명 데이터를 Base64 이미지 URL로 추출 (getDataURL() 호출)
        const data = sigCanvas.current?.getDataURL();
        if (data) {
            setSignatureData(data);
            console.log("Signature Data:", signatureData);

            // 실제 로직: 상품 정보(product.id)와 서명 데이터(data)를 서버에 전송합니다.
            // 전송 성공 후 완료 단계로 이동
            setStep('COMPLETE');
        }
    };

    const registerContent = (
        <div className="flex flex-col w-full items-center justify-center h-full p-6 text-center">
            {!product && (
                <QRScanner onScanSuccess={handleScanSuccess} scannerId={qrScannerId}/>
            )}
            {product && (
                <div className="flex-grow bg-white border border-gray-300 rounded-3xl overflow-hidden shadow-inner">
                    <SignatureCanvasComponent
                        canvasRef={sigCanvas} // ref 전달
                        width={400} // 캔버스 실제 해상도 설정
                        height={350} // 캔버스 실제 해상도 설정
                    />
                </div>
            )}

            <div className="flex flex-col w-full mt-6 p-4 justify-start text-left">
                <p className="font-bold text-lg text-black">{product?.productName || "상품명 인식중..."}</p>
                <p className="font-medium text-base text-black/60">{product?.partnerName || "파트너명 인식중..."}</p>
                <p className="font-medium text-base text-black/60">{product?.expiredAt ? `유효 기간 ~${mockProduct.expiredAt}` : "유효기간 인식중..."}</p>
            </div>

        </div>
    )


    // --- Step 3: Complete Logic ---
    const completeContent = (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center space-y-4">
            <Icon name={"check"} size={115}/>
            <span className="text-base font-medium text-(--color-blue-500)">쿠폰이 정상적으로 등록됐어요!</span>
        </div>
    );

    // --- Render based on Step ---
    const renderContent = () => {
        switch (step) {
            case 'INSTRUCTION':
                return instructionContent;
            case 'REGISTER':
                return registerContent;
            case 'COMPLETE':
                return completeContent;
            default:
                return <div className="p-8">알 수 없는 단계입니다.</div>;
        }
    };

    return (
        <div className={"flex flex-col gap-4 w-full min-h-[calc(100vh-var(--header-h,68px)-var(--bottom-nav-h,66px)-200px)]"}>
            <div
                className={"flex flex-1 flex-col pt-4 w-full h-full gap-4 rounded-3xl " +
                    "bg-white/80 backdrop-blur shadow-[0_0_4px_rgba(0,0,0,0.2)] items-center justify-center"}>
                {renderContent()}
            </div>

            {(product && step === 'REGISTER') &&
                <div className={"flex w-full"}>
                    <Button mode="color_fill" onClick={handleRegister}> 쿠폰 등록 </Button>
                </div>}
        </div>

    );
};
