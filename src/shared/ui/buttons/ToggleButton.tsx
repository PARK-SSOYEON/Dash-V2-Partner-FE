import React, {useState} from "react";
import {cva} from "class-variance-authority";
import {cn} from "../../lib/cn.ts";
import {Icon} from "../Icon.tsx";
import type {IconName} from "../icons/IconRegistry.ts";

type ToggleSide = "left" | "right" | null;

interface SegmentedToggleProps {
    leftIcon: IconName;
    rightIcon: IconName;
    onChange?: (value: ToggleSide) => void;
    className?: string;
}

const iconVariants = cva(
    "relative z-10 flex h-11 w-11 items-center justify-center text-2xl transition-colors duration-200",
    {
        variants: {
            active: {
                true: "text-white",
                false: "text-black",
            },
            dimmed: {
                true: "text-black/30",
                false: "",
            },
        },
        defaultVariants: {
            active: false,
            dimmed: false,
        },
    }
);

export const ToggleButton: React.FC<SegmentedToggleProps> = ({
                                                                 leftIcon,
                                                                 rightIcon,
                                                                 onChange,
                                                                 className,
                                                             }) => {
    const [value, setValue] = useState<ToggleSide>(null);

    const hasSelection = value !== null;

    const handleClick = (side: Exclude<ToggleSide, null>) => {
        const next: ToggleSide = value === side ? null : side;
        setValue(next);
        onChange?.(next);
    };

    const sliderPosition =
        value === "left"
            ? "translate-x-0 opacity-100"
            : value === "right"
                ? "translate-x-full opacity-100"
                : "translate-x-0 opacity-0 scale-90";

    return (
        <div
            className={cn(
                "relative flex px-2 py-1 items-center rounded-full border border-slate-200 bg-white shadow-sm ",
                className
            )}
        >
            {/* 파란 원(슬라이더) */}
            <div
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-y-1 left-2 h-11 w-11 rounded-full bg-blue-500 shadow-md transition-all duration-300 ease-out",
                    sliderPosition
                )}
            />

            {/* 왼쪽 버튼 */}
            <button
                type="button"
                className="relative z-10 flex flex-1 justify-center"
                onClick={() => handleClick("left")}
                aria-pressed={value === "left"}
            >
                <span
                    className={iconVariants({
                        active: value === "left",
                        dimmed: hasSelection && value !== "left",
                    })}
                >
                  <Icon name={leftIcon} size={24}/>
                </span>
            </button>

            {/* 오른쪽 버튼 */}
            <button
                type="button"
                className="relative z-10 flex flex-1 justify-center"
                onClick={() => handleClick("right")}
                aria-pressed={value === "right"}
            >
                <span
                    className={iconVariants({
                        active: value === "right",
                        dimmed: hasSelection && value !== "right",
                    })}
                >
                  <Icon name={rightIcon} size={24}/>
                </span>
            </button>
        </div>
    );
}
