import React, { useEffect, useRef, useState } from "react";
import '../../../shared/styles/QRScanner.css';
import {
    Html5Qrcode,
    Html5QrcodeSupportedFormats,
} from "html5-qrcode";

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    scannerId: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, scannerId }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const hasStartedRef = useRef(false);
    const [isScanned, setIsScanned] = useState(false);

    useEffect(() => {
        console.log("📌 [QRScanner] useEffect fired");

        if (hasStartedRef.current) {
            console.log("📌 [QRScanner] already started, skipping (StrictMode guard)");
            return;
        }
        hasStartedRef.current = true;

        const container = document.getElementById(scannerId);
        if (!container) {
            console.error("❌ [QRScanner] container not found:", scannerId);
            return;
        }

        // 이미 뭔가 들어있으면 비워주기
        container.innerHTML = "";
        console.log("📌 [QRScanner] container cleared before start");

        // Html5Qrcode 인스턴스 생성 (UI 래퍼 아님)
        const html5QrCode = new Html5Qrcode(scannerId, {
            verbose: true,
        });
        scannerRef.current = html5QrCode;

        const config = {
            fps: 10,
            qrbox: { width: 320, height: 320 },
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: false,
            },
            videoConstraints: {
                facingMode: { exact: "environment" },
                aspectRatio: { ideal: 1.777 }
            },
        };

        console.log("📌 [QRScanner] calling html5QrCode.start()");

        const startScanner = () => {
            console.log("📌 [QRScanner] calling html5QrCode.start() after delay");
            html5QrCode
                .start(
                    { facingMode: { exact: "environment" } },
                    config,
                    (decodedText: string) => {
                        console.log("📌 [QRScanner] scan success:", decodedText);
                        setIsScanned(true);
                        onScanSuccess(decodedText);
                    },
                    () => {}
                )
                .then(() => {
                    console.log("📌 [QRScanner] html5QrCode.start() resolved");
                })
                .catch((err) => {
                    console.error("❌ [QRScanner] html5QrCode.start() failed:", err);
                });
        };

        // 디버깅용: DOM에 뭐가 들어갔는지 확인
        setTimeout(() => {
            const el = document.getElementById(scannerId) as HTMLDivElement | null;
            if (!el) {
                console.log("📌 [QRScanner] container not found after start");
                return;
            }

            const rect = el.getBoundingClientRect();
            console.log(
                "📌 [QRScanner] container after start:",
                {
                    innerHTMLLength: el.innerHTML.length,
                    offsetWidth: el.offsetWidth,
                    offsetHeight: el.offsetHeight,
                    clientWidth: el.clientWidth,
                    clientHeight: el.clientHeight,
                    rect,
                }
            );
        }, 1000);

        const timer = setTimeout(startScanner, 100);

        return () => {
            console.log("📌 [QRScanner] cleanup");
            clearTimeout(timer);

            if (!scannerRef.current) return;

            const qr = scannerRef.current;
            // 바로 null로 만들어서 중복 stop/clear를 방지
            scannerRef.current = null;

            (async () => {
                try {
                    await qr.stop();
                } catch (err) {
                    console.warn("📌 [QRScanner] stop error on unmount (ignored):", err);
                }

                try {
                    await qr.clear();
                } catch (err) {
                    console.warn("📌 [QRScanner] clear error on unmount (ignored):", err);
                }
            })();
        };
    }, [onScanSuccess, scannerId]);

    return (
        <div className="flex flex-col items-center justify-center space-y-2 bg-white">
            <div
                className="relative"
                style={{width: 320, height: 320}}
            >
                <div
                    id={scannerId}
                    className="w-full h-full bg-white rounded-3xl overflow-hidden qr-scanner-container"
                    style={{ width: "100%", height: "100%" }}
                />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                        className={`absolute top-2 left-2 w-20 h-20 border-4 ${
                            isScanned ? "border-(--color-blue-500)" : "border-gray-400"
                        } border-b-0 border-r-0 rounded-tl-3xl`}
                    />
                    <div
                        className={`absolute top-2 right-2 w-20 h-20 border-4 ${
                            isScanned ? "border-(--color-blue-500)" : "border-gray-400"
                        } border-b-0 border-l-0 rounded-tr-3xl`}
                    />
                    <div
                        className={`absolute bottom-2 left-2 w-20 h-20 border-4 ${
                            isScanned ? "border-(--color-blue-500)" : "border-gray-400"
                        } border-t-0 border-r-0 rounded-bl-3xl`}
                    />
                    <div
                        className={`absolute bottom-2 right-2 w-20 h-20 border-4 ${
                            isScanned ? "border-(--color-blue-500)" : "border-gray-400"
                        } border-t-0 border-l-0 rounded-br-3xl`}
                    />

                    <p className="text-base font-medium text-(--color-blue-500) text-center">
                        결제코드를<br />가이드에 맞춰주세요
                    </p>
                </div>
            </div>
        </div>
    );
};
