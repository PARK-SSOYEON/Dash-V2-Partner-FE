import * as React from "react";
import {LoginHeader, type HeaderStep} from "./LoginHeader";
import {formatPhone, isValidPhone} from "../../../shared/lib/phone.ts";
import {isValidOtp} from "../../../shared/lib/otp.ts";
import {InputGroup} from "../../../shared/ui/input/InputGroup.tsx";
import {IconButton} from "../../../shared/ui/buttons/IconButton.tsx";
import {Button} from "../../../shared/ui/buttons/Button.tsx";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {useNavigate} from "react-router-dom";
import {useLoginByPhone} from "../model/useLoginByPhone.ts";
import type { LoginByPhoneResponse } from "../api/loginByPhone.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {useVerifyPhoneCode} from "../model/useVerifyPhoneCode.ts";
import {useFinalizePhoneLogin} from "../model/useFinalizePhoneLogin.ts";
import {useAuthStore} from "../../../shared/store/authStore.ts";

type Step = "phone" | "otp" | "done";

export function LoginForm() {
    const { mutate: loginByPhone } = useLoginByPhone();
    const { mutate: verifyPhoneCode} = useVerifyPhoneCode();
    const { mutate: finalizePhoneLogin} = useFinalizePhoneLogin();

    const navigate = useNavigate();
    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setPhoneAuthToken = useAuthStore((s) => s.setPhoneAuthToken);

    React.useEffect(() => {
        hideBottomMenu();
    }, []);

    const [step, setStep] = React.useState<Step>("phone");
    const [loginResult, setLoginResult] = React.useState<LoginByPhoneResponse | null>(null);
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [phone, setPhone] = React.useState("");
    const phoneValid = isValidPhone(phone);

    const [otp, setOtp] = React.useState("");
    const otpValid = isValidOtp(otp);

    const [userName, setUserName] = React.useState<string | null>(null);

    const headerStep: HeaderStep = step === "otp" ? "otp" : "default";

    const goNextFromPhone = () => {
        if (!phoneValid) {
            setErrorMsg("올바르지 않은 형식 (010-XXXX-XXXX)");
            return;
        }
        setErrorMsg(undefined);

        loginByPhone(phone, {
            onSuccess: (data: LoginByPhoneResponse) => {
                setLoginResult(data);
                setStep("otp");
            },
            onError: (error: ApiError) => {
                if (error.code === "ERR-IVD-PARAM") {
                    setErrorMsg("전화번호 형식이 올바르지 않습니다.");
                } else if (error.code === "ERR-RETRY-EXCEED") {
                    setErrorMsg("로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.");
                } else {
                    setErrorMsg(error.message ?? "로그인에 실패했습니다.");
                }
            },
        });
    };

    const goNextFromOtp = () => {
        if (!otpValid) {
            setErrorMsg("인증번호가 올바르지 않습니다");
            return;
        }
        setErrorMsg(undefined);

        verifyPhoneCode(otp, {
            onSuccess: (data) => {
                // 신규 회원: phoneAuthToken 저장 후 /sign 으로 이동
                if (loginResult && loginResult.isUsed === false) {
                    setPhoneAuthToken(data.phoneAuthToken);
                    setStep("done");
                    return;
                }

                // 기존 회원: phoneAuthToken 저장 후 최종 로그인 진행
                setPhoneAuthToken(data.phoneAuthToken);
                finalizePhoneLogin(data.phoneAuthToken, {
                    onSuccess: (loginData) => {
                        setAccessToken(loginData.accessToken);
                        setUserName(loginData.name ?? null);
                        setStep("done");
                    },
                    onError: (error: ApiError) => {
                        setErrorMsg(error.message ?? "로그인 처리에 실패했습니다.");
                    },
                });
            },
            onError: (error: ApiError) => {
                if (error.code === "ERR-IVD-VALUE") {
                    setErrorMsg("인증번호가 일치하지 않습니다.");
                } else {
                    setErrorMsg(error.message ?? "인증에 실패했습니다.");
                }
            },
        });
    };


    return (
        <div
            className="relative overflow-hidden flex flex-col"
            style={{
                minHeight:
                    "calc(100vh - (env(safe-area-inset-bottom) + var(--bottom-nav-h,66px) + var(--gutter,24px) + 1rem))",
            }}
        >
            <LoginHeader step={headerStep}/>

            {/* 하단 단계 컨테이너 */}
            <div className="flex-1 w-full flex items-center">
                {step === "phone" && (
                    <InputGroup
                        label="전화번호"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        inputMode="tel"
                        errorMessage={errorMsg}
                        rightAction={{
                            onClick: goNextFromPhone,
                            visible: phoneValid,
                            mode: "blue_line",
                        }}
                    />
                )}

                {step === "otp" && (
                    <InputGroup
                        label="인증번호"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        inputMode="numeric"
                        errorMessage={errorMsg}
                        leftAction={{
                            onClick: () => setStep("phone"),
                            visible: !otpValid,
                            mode: "mono",
                        }}
                        rightAction={{
                            onClick: goNextFromOtp,
                            visible: otpValid,
                            mode: "blue_line",
                        }}
                    />
                )}

                {step === "done" && (
                    <div className="flex flex-row items-center gap-2 w-full justify-center ">
                        <IconButton
                            mode="mono"
                            icon="leftArrow"
                            onClick={() => setStep("otp")}
                        />
                        <Button
                            mode="color_fill"
                            icon={"identify"}
                            iconPosition='left'
                            onClick={() => navigate(loginResult?.isUsed ? "/coupon" : "/sign")}
                        >
                            {loginResult?.isUsed
                                ? `${userName ?? "000"}으로 계속`
                                : "새롭게 시작하기"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
