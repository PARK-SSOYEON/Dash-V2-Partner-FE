import * as React from "react"
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {formatPhone, isValidPhone} from "../../../shared/lib/phone.ts";
import {isValidOtp} from "../../../shared/lib/otp.ts";
import {Input} from "../../../shared/ui/input/Input.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
type IssueStep = "phone" | "otp";


export function SettingPhoneForm() {
    const [step, setStep] = useState<IssueStep>("phone");
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [phone, setPhone] = React.useState("");
    const phoneValid = isValidPhone(phone);

    const [otp, setOtp] = React.useState("");
    const otpValid = isValidOtp(otp);

    const navigate=useNavigate();

    const goNextFromPhone = () => {
        if (!phoneValid) {
            setErrorMsg("올바르지 않은 형식 (010-XXXX-XXXX)");
            return;
        }
        setErrorMsg(undefined);
        setStep("otp");
    };

    const goNextFromOtp = () => {
        if (!otpValid) {
            setErrorMsg("인증번호가 올바르지 않습니다");
            return;
        }
        setErrorMsg(undefined);
        navigate('/settings')
    };

    const stepMessages: Record<IssueStep, string> = {
        "phone": "변경할 전화번호를 \n 입력해주세요",
        "otp": "보내드린 인증번호를 \n 입력해주세요",
    };

    return (
        <div className={"flex flex-col flex-1 bg-white p-8 gradient-border w-full rounded-4xl gap-6 "}>
            <div className={"font-medium text-2xl whitespace-pre-line leading-loose"}>
                {stepMessages[step]}
            </div>

            <div className={"w-full flex flex-col gap-6"}>
                {step === "phone" && (
                    <Input
                        label="새로운 전화번호"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        inputMode="tel"
                        errorMessage={errorMsg}
                    />
                )}

                {step === "otp" && (
                    <Input
                        label="인증번호"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        inputMode="numeric"
                        errorMessage={errorMsg}
                    />
                )}
            </div>

            <div
                className={"flex flex-row gap-3 fixed left-1/2 -translate-x-1/2 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md "}
                style={{
                    width: "min(calc(100vw - (var(--gutter,24px) * 2)), calc(var(--container-max,450px) - (var(--gutter,24px) * 2)))",
                    bottom: "max(1.5rem, env(safe-area-inset-bottom))",
                    height: "var(--bottom-nav-h,66px)",
                }}>
                <Button
                    mode="mono"
                    icon={"leftChevron"}
                    iconPosition='left'
                    onClick={()=>navigate('/settings')}
                >
                    변경 취소
                </Button>
                <Button
                    mode={"color_fill"}
                    icon={"rightChevron"}
                    iconPosition='right'
                    onClick={step==="phone" ? goNextFromPhone : goNextFromOtp}
                >
                    {step === "phone" ? "번호 인증" : "전화번호 변경"}
                </Button>
            </div>
        </div>
    )
}
