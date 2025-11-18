import React, {useEffect, useImperativeHandle, useRef, useState} from "react";

export interface SignatureCanvasRef {
    clear: () => void;
    getDataURL: () => string | null;
    isEmpty: () => boolean;
}

interface CustomSignatureCanvasProps {
    canvasRef: React.RefObject<SignatureCanvasRef | null>;
    width: number;
    height: number;
}

export const SignatureCanvasComponent: React.FC<CustomSignatureCanvasProps> = ({ canvasRef, width, height }) => {
    const canvasElementRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    // useImperativeHandle을 사용하여 부모 컴포넌트에 메소드를 노출합니다.
    useImperativeHandle(canvasRef, () => ({
        clear: () => {
            const canvas = canvasElementRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // 배경을 흰색으로 다시 칠합니다.
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    setHasDrawn(false);
                }
            }
        },
        getDataURL: () => {
            const canvas = canvasElementRef.current;
            // 'react-signature-canvas'의 getTrimmedCanvas()와 유사하게 작동하도록
            // 여기서는 전체 canvas 데이터를 반환합니다. (트리밍 로직은 복잡하여 생략)
            if (canvas && hasDrawn) {
                return canvas.toDataURL('image/png');
            }
            return null;
        },
        isEmpty: () => !hasDrawn,
    }));

    // 초기 캔버스 설정: 배경색, 선 스타일
    useEffect(() => {
        const canvas = canvasElementRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // 스타일 설정
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'black';
                ctx.fillStyle = 'white';
                // 배경을 흰색으로 채움
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
        // 컴포넌트 마운트 시 한번만 실행되도록 설정
    }, [width, height]);


    // 마우스/터치 좌표 계산
    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        const canvas = canvasElementRef.current;
        const rect = canvas?.getBoundingClientRect();
        if (!canvas || !rect) return null;

        let clientX: number, clientY: number;
        if ('touches' in e && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if ('clientX' in e) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            return null;
        }

        // 캔버스 엘리먼트 크기와 실제 캔버스 해상도 간의 비율을 고려하여 좌표 계산
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    // 그리기 시작
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const coords = getCoordinates(e);
        if (!coords) return;

        const ctx = canvasElementRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(coords.x, coords.y);
            setIsDrawing(true);
            setHasDrawn(true);
        }
    };

    // 그리기 진행
    const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const coords = getCoordinates(e);
        if (!coords) return;

        const ctx = canvasElementRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
        }
    };

    // 그리기 종료 (글로벌 이벤트 리스너로 일관성 확보)
    const stopDrawing = () => {
        if (isDrawing) {
            canvasElementRef.current?.getContext('2d')?.closePath();
            setIsDrawing(false);
        }
    };

    // 글로벌 이벤트 리스너 등록: 캔버스 밖에서 마우스를 떼도 그리기가 멈추도록 합니다.
    useEffect(() => {
        window.addEventListener('mouseup', stopDrawing);
        window.addEventListener('touchend', stopDrawing);
        window.addEventListener('mousemove', draw);
        window.addEventListener('touchmove', draw);

        return () => {
            window.removeEventListener('mouseup', stopDrawing);
            window.removeEventListener('touchend', stopDrawing);
            window.removeEventListener('mousemove', draw);
            window.removeEventListener('touchmove', draw);
        };
    }, [isDrawing]); // isDrawing 상태가 변경될 때마다 핸들러가 갱신되어야 합니다.

    return (
        <canvas
            ref={canvasElementRef}
            width={width} // 실제 캔버스 해상도 (attribute)
            height={height} // 실제 캔버스 해상도 (attribute)
            onMouseDown={startDrawing}
            onTouchStart={startDrawing}
            className="w-full h-full cursor-crosshair" // CSS로 크기 조절 (style)
            style={{ touchAction: 'none' }} // 터치 시 스크롤 방지
        />
    );
};
