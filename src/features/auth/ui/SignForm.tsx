import * as React from "react";
import {cva} from "class-variance-authority";
import {SignHeader} from "./SignHeader.tsx";
import {InputGroup} from "../../../shared/ui/input/InputGroup.tsx";
import {cn} from "../../../shared/lib/cn.ts";
import {MultiDropdownSelector} from "../../../shared/ui/dropdown/MultiDropdownSelector.tsx";
import {IconButton} from "../../../shared/ui/buttons/IconButton.tsx";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {useRegisterMember} from "../model/useRegisterMember.ts";
import {useAuthStore} from "../../../shared/store/authStore.ts";
import {useNavigate} from "react-router-dom";
import type {ApiError} from "../../../shared/types/api.ts";
import {formatBirthInput, isValidBirthDate} from "../lib/birth.ts";

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

const sampleData = [
    {id: '1', label: '아주대학교'},
    {id: '2', label: '소프트웨어 융합학과'},
    {id: '3', label: '검색어에 해당하는 선택자 1'},
    {id: '4', label: '검색어에 해당하는 선택자 2'},
    {id: '6', label: '검색어에 해당하는 선택자 3'},
    {id: '7', label: '검색어에 해당하는 선택자 4'},
    {id: '5', label: '사이버보안학과'},
];

export function SignForm() {
    const { mutate: registerMember } = useRegisterMember();
    const phoneAuthToken = useAuthStore((s) => s.phoneAuthToken);
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    const navigate = useNavigate();

    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);

    React.useEffect(() => {
        hideBottomMenu();
    }, []);

    const [name, setName] = React.useState("");
    const [birth, setBirth] = React.useState("");
    const [affiliation, setAffiliation] = React.useState<string[]>([]);

    const [activeQuestion, setActiveQuestion] = React.useState<1 | 2 | 3>(1);
    const [nameDone, setNameDone] = React.useState(false);
    const [birthDone, setBirthDone] = React.useState(false);
    const [affiliationDone, setAffiliationDone] = React.useState(false);
    const [birthError, setBirthError] = React.useState<string>("");
    const [birthErrorTrigger, setBirthErrorTrigger] = React.useState(false);

    const [introVisible, setIntroVisible] = React.useState(true);
    const [signCompleted, setSignCompleted] = React.useState(false);

    React.useEffect(() => {
        const t = setTimeout(() => setIntroVisible(false), 2000);
        return () => clearTimeout(t);
    }, []);

    React.useEffect(() => {
        if (!phoneAuthToken) {
            navigate("/login", { replace: true });
        }
    }, [phoneAuthToken, navigate]);

    const handleSignSubmit = () => {
        if (!phoneAuthToken) return;

        registerMember(
            {
                phoneAuthToken,
                memberName: name,
                memberBirth: birth,
                departAt: affiliation,
            },
            {
                onSuccess: (data) => {
                    setSignCompleted(true);
                    setAccessToken(data.accessToken);
                    setTimeout(() => {
                        navigate("/coupon", { replace: true });
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
                                value: name,
                                setValue: setName,
                                done: nameDone,
                                setDone: setNameDone,
                                getTitle: () =>
                                    nameDone && name
                                        ? `1. ${name}님, 안녕하세요!`
                                        : "1. 이용자분의 이름은 무엇인가요?",
                                inputLabel: "이름",
                            },
                            {
                                id: 2,
                                value: birth,
                                setValue: setBirth,
                                done: birthDone,
                                setDone: setBirthDone,
                                getTitle: () =>
                                    birthDone && birth
                                        ? `2. ${birth.slice(5, 7)}월 ${birth.slice(8, 10)}일 생일이시군요! 기억할게요 😎`
                                        : "2. 생일은 언제세요?",
                                inputLabel: "생일 (YYYY.MM.DD)",
                            },
                            {
                                id: 3,
                                value: affiliation.join(", "),
                                setValue: () => {
                                },
                                done: affiliationDone,
                                setDone: setAffiliationDone,
                                getTitle: () =>
                                    affiliationDone && affiliation.length > 0
                                        ? `3. 지금 다니시는 곳은 ${affiliation.join(", ")}`
                                        : "3. 지금 다니시는 학교나 회사, 단체가 있나요?",
                                inputLabel: "소속단체",
                            },
                        ];

                        const order: QuestionId[] = [1, 2, 3];

                        return order.map((id, index) => {
                            const q = questions.find((item) => item.id === id)!;
                            const prev = index > 0 ? questions.find((item) => item.id === order[index - 1])! : q;

                            const shouldShow =
                                id === 1 || prev.done || activeQuestion === id;

                            if (!shouldShow) return null;

                            const isActive = activeQuestion === id;
                            const isFilled = !!q.value;

                            const handleSubmit = () => {
                                if (!q.value.trim()) return;

                                if (id === 2) {
                                    if (!isValidBirthDate(birth)) {
                                        setBirthError("생년월일이 올바르지 않습니다");
                                        setBirthErrorTrigger((prev) => !prev);
                                        return;
                                    } else {
                                        setBirthError("");
                                    }
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

                                    {isActive && id === 3 && (
                                        <div className="flex flex-row gap-2">
                                            <MultiDropdownSelector
                                                placeholder="소속단체 모두 선택"
                                                searchPlaceholder="검색 키워드를 입력해주세요"
                                                data={sampleData}
                                                onSelect={(items) => setAffiliation(items.map(i => i.label))}
                                            />
                                            <IconButton
                                                mode={"blue_line"}
                                                icon={"rightArrow"}
                                                onClick={handleSignSubmit}/>
                                        </div>
                                    )}

                                    {isActive && id !== 3 && (
                                        <InputGroup
                                            label={q.inputLabel}
                                            value={q.value}
                                            onChange={
                                                id === 2
                                                    ? (e) => {
                                                        q.setValue(formatBirthInput(e.target.value));
                                                    }
                                                    : (e) => q.setValue(e.target.value)
                                            }
                                            rightAction={{
                                                onClick: () => {
                                                    handleSubmit();
                                                },
                                                visible: isFilled,
                                                mode: "blue_line",
                                            }}
                                            {...(id === 2
                                                ? {
                                                    errorMessage: birthError,
                                                    errorTrigger: birthErrorTrigger,
                                                }
                                                : {})}
                                        />
                                    )}
                                </div>

                            );
                        });
                    })()}
                </div>
            )}
        </div>
    )
}
