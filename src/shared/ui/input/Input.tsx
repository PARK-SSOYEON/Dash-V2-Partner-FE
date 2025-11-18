import * as React from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "../../lib/cn.ts";

const containerBase = "relative flex-1 rounded-full px-1 pt-5 pb-1 ";

const containerVariants = cva(containerBase, {
    variants: {
        mode: {
            mono:
                "gradient-border bg-white/60 text-(--color-gray-500) focus-within:ring-offset-2 focus-within:ring-offset-white ",
            color_line:
                "border border-(--color-blue-500) bg-white text-(--color-blue-600) focus-within:ring-offset-2 focus-within:ring-offset-white ",
            error:
                "border border-(--color-red-500) bg-white text-(--color-red-600) focus-within:ring-offset-2 focus-within:ring-offset-white ",
        },
    },
    defaultVariants: {
        mode: "mono",
    },
});

const inputStyles =
    "w-full outline-none placeholder-transparent font-semibold text-lg leading-7 px-8 pt-2 pb-1 ";


const labelBase =
    "absolute px-8 select-none transition-all duration-200 ease-out pointer-events-none pt-1 ";

const labelCentered = "top-1/2 -translate-y-1/2 text-base ";
const labelFloating = "top-2 translate-y-0 text-xs font-semibold ";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
    VariantProps<typeof containerVariants> & {
    errorMessage?: string;
    errorTrigger?: boolean;
    autoMode?: boolean; //false: 직접 mode 선택 가능
    label?: string; //placeholder
    errorAutoClearMs?: number;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>
(
    (
        {
            className,
            mode: modeProp,
            label,
            errorMessage,
            errorTrigger,
            errorAutoClearMs = 3000,
            autoMode = true,
            value,
            defaultValue,
            onFocus,
            onBlur,
            onChange,
            ...props
        },
        ref
    ) => {
        const [focused, setFocused] = React.useState(false);
        const [internalValue, setInternalValue] = React.useState <string | number | readonly string[] | undefined>(
            defaultValue
        );
        const [showError, setShowError] = React.useState(false);
        const errorTimer = React.useRef<number | null>(null);

        const hasValue = (() => {
            const v = (value ?? internalValue) as any;
            return v !== undefined && v !== null && String(v).length > 0;
        })();

        React.useEffect(() => {
            if (errorMessage && String(errorMessage).trim().length > 0) {
                setShowError(true);
                if (errorTimer.current) window.clearTimeout(errorTimer.current);
                errorTimer.current = window.setTimeout(() => {
                    setShowError(false);
                }, errorAutoClearMs);
            }
            return () => {
                if (errorTimer.current) window.clearTimeout(errorTimer.current);
            };
        }, [errorTrigger]);

        const computedMode: NonNullable<InputProps["mode"]> = (() => {
            if (showError) return "error";
            if (!autoMode) return (modeProp as any) ?? "mono";
            return focused || hasValue ? "color_line" : "mono";
        })();

        return (
            <div className={cn(containerVariants({mode: computedMode}), className)}>
                {label ? (
                    <div
                        className={cn(
                            labelBase,
                            (showError || hasValue || focused) ? labelFloating : labelCentered,
                            "flex items-center justify-between gap-2 w-full "
                        )}
                    >
                        <span>{label}</span>
                        {showError && errorMessage ? (
                            <span
                                className="text-(--color-red-500) text-xs whitespace-nowrap font-light ">{errorMessage}</span>
                        ) : null}
                    </div>
                ) : null}

                <input
                    ref={ref}
                    className={inputStyles}
                    value={value as any}
                    defaultValue={defaultValue}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onChange?.(e);
                    }}
                    onFocus={(e) => {
                        setFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";
