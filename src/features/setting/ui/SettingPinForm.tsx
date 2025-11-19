import * as React from "react"
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {isValidOtp} from "../../../shared/lib/otp.ts";
import {Input} from "../../../shared/ui/input/Input.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {useIsLandscape} from "../../../shared/hook/useIsLandscape.ts";
import {useAuthStore} from "../../../shared/store/authStore.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {useChangePin} from "../hook/useChangePin.ts";

type IssueStep = "prevPin" | "newPin";

export function SettingPinForm() {
    const [step, setStep] = useState<IssueStep>("prevPin");
    const { mutate: changePin, isPending } = useChangePin();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [prevPin, setPrevPin] = React.useState("");
    const prevPinValid = isValidOtp(prevPin);

    const [newPin, setNewPin] = React.useState("");
    const newPinValid = isValidOtp(newPin);

    const navigate = useNavigate();
    const isLandScape = useIsLandscape();

    const goNextFromPrevPin = () => {
        if (!prevPinValid) {
            setErrorMsg("PIN이 올바르지 않습니다");
            return;
        }
        setErrorMsg(undefined);
        setStep("newPin")
    };

    const goNextFromNewPin = () => {
        if (!newPinValid) {
            setErrorMsg("PIN이 올바르지 않습니다");
            return;
        }
        if (!prevPinValid) {
            setErrorMsg("현재 PIN이 올바르지 않습니다");
            setStep("prevPin");
            return;
        }
        setErrorMsg(undefined);

        changePin(
            { prevPin, newPin },
            {
                onSuccess: (data) => {
                    setAccessToken(data.accessToken);
                    navigate("/settings");
                },
                onError: (error: ApiError) => {
                    if (error.code === "ERR-IVD-VALUE") {
                        setErrorMsg("현재 PIN이 일치하지 않습니다");
                        setStep("prevPin");
                        setPrevPin("");
                    } else if (error.code === "ERR-AUTH") {
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        navigate("/login");
                    } else {
                        setErrorMsg(error.message ?? "PIN 변경 중 오류가 발생했습니다.");
                    }
                },
            }
        );
    };

    const stepMessages: Record<IssueStep, string> = {
        "prevPin": "현재 사용중인 PIN을 \n 입력해주세요",
        "newPin": "새로 사용할 PIN을 \n 입력해주세요",
    };

    return (
        <div className={"flex flex-col flex-1 bg-white p-8 gradient-border w-full rounded-4xl gap-6 "}>
            <div className={"font-medium text-2xl whitespace-pre-line leading-loose"}>
                {stepMessages[step]}
            </div>

            <div className={"w-full flex flex-col gap-6"}>
                {step === "prevPin" && (
                    <Input
                        label="현재 PIN"
                        value={prevPin}
                        onChange={(e) =>
                            setPrevPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        inputMode="numeric"
                        errorMessage={errorMsg}
                    />
                )}

                {step === "newPin" && (
                    <Input
                        label="새로운 PIN"
                        value={newPin}
                        onChange={(e) =>
                            setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        inputMode="numeric"
                        errorMessage={errorMsg}
                    />
                )}
            </div>

            <div
                className={"flex flex-row gap-3 fixed left-1/2 -translate-x-1/2 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md "}
                style={{
                    width: isLandScape
                        ? "calc(((100vw * 2 / 3) - (var(--gutter,48px) * 2))*0.7)"
                        : "calc((100vw - (var(--gutter,48px) * 2))*0.7)",
                    left: isLandScape ? "33vw" : "50%",
                    bottom: "max(2rem, env(safe-area-inset-bottom))",
                    height: "var(--bottom-nav-h,66px)",
                }}>
                <Button
                    mode="mono"
                    icon={"leftChevron"}
                    iconPosition='left'
                    onClick={() => {
                        if (step === "prevPin") {
                            navigate('/settings');
                        } else {
                            setStep('prevPin');
                        }
                    }}
                >
                    {step === "prevPin" ? "변경 취소" : "이전"}
                </Button>
                <Button
                    mode={"color_fill"}
                    icon={"rightChevron"}
                    iconPosition='right'
                    onClick={step === "prevPin" ? goNextFromPrevPin : goNextFromNewPin}
                    disabled={
                        isPending ||
                        (step === "prevPin" ? !prevPinValid : !newPinValid)
                    }
                >
                    {step === "prevPin" ? "다음" : "PIN 변경"}
                </Button>
            </div>
        </div>
    )
}
