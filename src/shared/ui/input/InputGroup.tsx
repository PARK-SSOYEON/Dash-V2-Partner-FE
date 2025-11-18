import * as React from "react";
import {Input} from "./Input.tsx";
import {cn} from "../../lib/cn.ts";
import {IconButton} from "../buttons/IconButton.tsx";

type ActionConfig = {
    onClick: () => void;
    visible: boolean;
    mode?: React.ComponentProps<typeof IconButton>["mode"];
};

type Props = {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    errorMessage?: string;
    errorTrigger?: boolean

    leftAction?: ActionConfig;
    rightAction?: ActionConfig;
};

export function InputGroup({
                               label,
                               value,
                               onChange,
                               inputMode,
                               errorMessage,
                               errorTrigger,
                               leftAction,
                               rightAction,
                           }: Props) {
    return (
        <div className="relative w-full flex items-center">
            {/* Left Action */}
            {leftAction && (
                <div
                    className={cn(
                        "transition-all duration-300 flex items-center justify-start",
                        leftAction.visible ? "w-18" : "w-0"
                    )}
                >
                    <IconButton
                        mode={leftAction.mode ?? "mono"}
                        icon="leftArrow"
                        onClick={leftAction.onClick}
                        className={cn(
                            "transition-opacity duration-300",
                            leftAction.visible ? "opacity-100" : "opacity-0"
                        )}
                    />
                </div>
            )}

            {/* Input */}
            <div className="transition-all duration-300 flex-1">
                <Input
                    label={label}
                    value={value}
                    onChange={onChange}
                    inputMode={inputMode}
                    autoMode
                    errorMessage={errorMessage}
                    errorTrigger={errorTrigger}
                    className="transition-all duration-300"
                />
            </div>

            {/* Right Action */}
            {rightAction && (
                <div
                    className={cn(
                        "transition-all duration-300 flex items-center justify-end",
                        rightAction.visible ? "w-18" : "w-0"
                    )}
                >
                    <IconButton
                        mode={rightAction.mode ?? "blue_line"}
                        icon="rightArrow"
                        onClick={rightAction.onClick}
                        className={cn(
                            "transition-opacity duration-300",
                            rightAction.visible ? "opacity-100" : "opacity-0"
                        )}
                    />
                </div>
            )}
        </div>
    );
}
