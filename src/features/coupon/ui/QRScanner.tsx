import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    scannerId: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, scannerId }) => {

    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isScanned, setIsScanned] = useState(false);

    useEffect(() => {
        // 이미 생성된 스캐너가 있으면 정리
        console.log("📌 [QRScanner] useEffect fired");

        if (scannerRef.current) {
            console.log("📌 [QRScanner] clearing previous scanner");

            scannerRef.current.clear().catch(() => {
                // ignore clear error
            });
            scannerRef.current = null;
        }

        const config = {
            fps: 10,
            qrbox: { width: 320, height: 450 },
            rememberLastUsedCamera: true,
            aspectRatio: 1.0,
        };

        const verbose = false;
        const scanner = new Html5QrcodeScanner(scannerId, config, verbose);
        console.log("📌 [QRScanner] clearing previous scanner");

        scannerRef.current = scanner;

        console.log("📌 [QRScanner] calling scanner.render()");
        scanner.render(
            (decodedText: string) => {
                console.log("📌 [QRScanner] scan success", decodedText);

                setIsScanned(true);
                onScanSuccess(decodedText);
                try {
                    scannerRef.current?.clear();
                } catch (_) {}
            },
            (errorMessage: string) => {
                // 스캔 에러는 콘솔에만 출력(사용자에게는 노출 X)
                console.warn("📌 [QRScanner] scan error", errorMessage);
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {
                    // ignore clear error
                });
                scannerRef.current = null;
            }
        };
    }, [onScanSuccess, scannerId]);

    return (
        <div className="flex flex-col items-center justify-center space-y-2 bg-white">
            <div className={"relative w-[320px] h-[450px]"}>
                <div
                    id={scannerId}
                    className="w-full h-full bg-white rounded-3xl overflow-hidden"
                ></div>
                <div className={"pointer-events-none absolute inset-0 flex items-center justify-center"}>
                    <div
                        className={`absolute top-2 left-2 w-20 h-20 border-4 ${isScanned ? "border-(--color-blue-500)" : "border-gray-400"} border-b-0 border-r-0 rounded-tl-3xl`}/>
                    <div
                        className={`absolute top-2 right-2 w-20 h-20 border-4 ${isScanned ? "border-(--color-blue-500)" : "border-gray-400"} border-b-0 border-l-0 rounded-tr-3xl`}/>
                    <div
                        className={`absolute bottom-2 left-2 w-20 h-20 border-4 ${isScanned ? "border-(--color-blue-500)" : "border-gray-400"} border-t-0 border-r-0 rounded-bl-3xl`}/>
                    <div
                        className={`absolute bottom-2 right-2 w-20 h-20 border-4 ${isScanned ? "border-(--color-blue-500)" : "border-gray-400"} border-t-0 border-l-0 rounded-br-3xl`}/>

                    {/* 안내 텍스트 */}
                    <p className="text-base font-medium text-(--color-blue-500) text-center">
                        등록코드를<br/>가이드에 맞춰주세요
                    </p>
                </div>

            </div>

        </div>
    );
};
