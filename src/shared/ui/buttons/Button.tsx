import * as React from "react";
import {cn} from "../../lib/cn.ts";
import {cva, type VariantProps} from "class-variance-authority";
import {Icon} from "../Icon.tsx";
import type {IconName} from "../icons/IconRegistry.ts";

const baseStyles = "flex flex-1 items-center justify-center rounded-full py-5 text-base gap-4 font-semibold"

const buttonVariants = cva(baseStyles, {
    variants: {
        mode: {
            mono:
                "gradient-border bg-white text-(--color-gray-500) hover:bg-(--color-gray-50) " +
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            blue_line:
                "border border-(--color-blue-500) bg-white/60 text-(--color-blue-500) hover:bg-(--color-blue-50) " +
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            red_line:
                "border border-(--color-red-500) bg-white/60 text-(--color-red-400) hover:bg-red-50" +
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            color_fill:
                "bg-(--color-blue-500) text-white hover:bg-(--color-blue-600) " +
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        },
    },
    defaultVariants: {
        mode: "blue_line",
    },
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    ButtonVariantProps & {
    icon?: IconName;
    iconPosition?: 'left' | 'right';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>
(
    (
        {
            mode,
            icon,
            iconPosition,
            children,
            className,
            ...props
        },
        ref
    ) => {
        const iconLeft = icon && iconPosition === 'left';
        const iconRight = icon && iconPosition === 'right';

        return (
            <button
                ref={ref}
                className={cn(buttonVariants({mode}), className)}
                {...props}
            >
                {iconLeft && <Icon name={icon} size={20} />}
                {children ? <span>{children}</span> : null}
                {iconRight && <Icon name={icon} size={20} />}
            </button>
        );
    }
);
