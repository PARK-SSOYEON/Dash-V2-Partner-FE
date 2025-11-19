import * as React from "react";
import {cva} from "class-variance-authority";
import {SignHeader} from "./SignHeader.tsx";
import {InputGroup} from "../../../shared/ui/input/InputGroup.tsx";
import {cn} from "../../../shared/lib/cn.ts";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {useRegisterPartner} from "../model/useRegisterPartner.ts";
import {useAuthStore} from "../../../shared/store/authStore.ts";
import {useNavigate} from "react-router-dom";
import type {ApiError} from "../../../shared/types/api.ts";

type QuestionId = 1 | 2 | 3;

const questionTitleVariants = cva("text-lg font-bold", {
    variants: {
        done: {
            true: "text-(--color-blue-500)",
            false: "text-black",
        },
    },
    defaultVariants: {
        done: false,
    },
});

export function SignForm() {
    const {mutate: registerMember} = useRegisterPartner();
    const phoneAuthToken = useAuthStore((s) => s.phoneAuthToken);
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    const navigate = useNavigate();

    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);

    React.useEffect(() => {
        hideBottomMenu();
    }, []);

    const [userName, setUserName] = React.useState("");
    const [partnerName, setPartnerName] = React.useState("");
    const [pin, setPin] = React.useState<string>("");

    const [activeQuestion, setActiveQuestion] = React.useState<1 | 2 | 3>(1);
    const [userNameDone, setUserNameDone] = React.useState(false);
    const [partnerNameDone, setPartnerNameDone] = React.useState(false);
    const [pinDone, setPinDone] = React.useState(false);

    const [introVisible, setIntroVisible] = React.useState(true);
    const [signCompleted, setSignCompleted] = React.useState(false);

    React.useEffect(() => {
        const t = setTimeout(() => setIntroVisible(false), 2000);
        return () => clearTimeout(t);
    }, []);

    React.useEffect(() => {
        if (!phoneAuthToken) {
            navigate("/login", {replace: true});
        }
    }, [phoneAuthToken, navigate]);

    const handleSignSubmit = () => {
        if (!phoneAuthToken) return;

        registerMember(
            {
                phoneAuthToken,
                userName,
                partnerName,
                pin,
            },
            {
                onSuccess: (data) => {
                    setSignCompleted(true);
                    setAccessToken(data.accessToken);
                    setTimeout(() => {
                        navigate("/coupon", {replace: true});
                    }, 2000);
                },
                onError: (error: ApiError) => {
                    if (error.code === "ERR-DUP-VALUE") {
                        alert("이미 가입된 회원입니다.");
                        navigate("/login", {replace: true})
                    } else {
                        alert(error.message ?? "회원가입에 실패했습니다.");
                        navigate("/login", {replace: true})
                    }
                },
            }
        );
    }

    return (
        <div
            className="relative overflow-hidden flex flex-col"
            style={{
                minHeight:
                    "calc(100vh - (env(safe-area-inset-bottom) + var(--bottom-nav-h,66px) + var(--gutter,24px) + 1rem))",
            }}
        >
            <SignHeader finalMode={signCompleted}/>

            {!signCompleted && (
                <div
                    className={cn(
                        "mt-16 flex flex-col gap-4 transition-all duration-700",
                        introVisible ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
                    )}
                >
                    {(() => {
                        const questions: {
                            id: QuestionId;
                            value: string;
                            setValue: (v: string) => void;
                            done: boolean;
                            setDone: (v: boolean) => void;
                            getTitle: () => string;
                            inputLabel: string;
                        }[] = [
                            {
                                id: 1,
                                value: userName,
                                setValue: setUserName,
                                done: userNameDone,
                                setDone: setUserNameDone,
                                getTitle: () =>
                                    userNameDone && userName
                                        ? `1. ${userName}님, 안녕하세요!`
                                        : "1. 이용자분의 이름은 무엇인가요?",
                                inputLabel: "이름",
                            },
                            {
                                id: 2,
                                value: partnerName,
                                setValue: setPartnerName,
                                done: partnerNameDone,
                                setDone: setPartnerNameDone,
                                getTitle: () =>
                                    partnerNameDone && partnerName
                                        ? `2. '${partnerName}' 매장을 운영하시는군요!`
                                        : "2. 운영하시는 매장의 상호는 무엇인가요?",
                                inputLabel: "매장 상호",
                            },
                            {
                                id: 3,
                                value: pin,
                                setValue: setPin,
                                done: pinDone,
                                setDone: setPinDone,
                                getTitle: () => "3. 사용하실 PIN을 입력해주세요!",
                                inputLabel: "로그인용 PIN번호 입력 (6자리)",
                            },
                        ];

                        const order: QuestionId[] = [1, 2, 3];

                        return order.map((id, index) => {
                            const q = questions.find((item) => item.id === id)!;
                            const prev = index > 0 ? questions.find((item) => item.id === order[index - 1])! : q;

                            const shouldShow =
                                id === 1 || prev.done || activeQuestion === id;

                            if (!shouldShow) return null;

                            const isFilled = !!q.value;

                            const handleSubmit = () => {
                                if (!q.value.trim()) return;
                                if (id===3){
                                    handleSignSubmit()
                                }

                                q.setDone(true);

                                const nextId = (id + 1) as QuestionId;
                                const hasNext = order.includes(nextId);
                                if (hasNext) {
                                    setActiveQuestion(nextId);
                                }
                            };

                            const handleClickTitle = () => {
                                if (q.done) {
                                    setActiveQuestion(id);
                                }
                            };

                            return (
                                <div key={id} className="flex flex-col gap-4">
                                    <button
                                        type="button"
                                        className="text-left"
                                        onClick={handleClickTitle}
                                    >
                                    <span
                                        className={questionTitleVariants({
                                            done: q.done,
                                        })}
                                    >
                                        {q.getTitle()}
                                    </span>
                                    </button>

                                    <InputGroup
                                        label={q.inputLabel}
                                        value={q.value}
                                        onChange={(e) => q.setValue(e.target.value)}
                                        rightAction={{
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                            visible: isFilled,
                                            mode: "blue_line",
                                        }}
                                    />

                                </div>
                            );
                        });
                    })()}
                </div>
            )}
        </div>
    )
}
