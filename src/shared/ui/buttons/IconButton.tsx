import * as React from "react";
import {cn} from "../../lib/cn.ts";
import {cva, type VariantProps} from "class-variance-authority";
import {Icon} from "../Icon.tsx";
import type {IconName} from "../icons/IconRegistry.ts";

const baseStyles = "flex items-center justify-center rounded-full px-0 py-5 text-base gap-4 font-semibold p-0 gap-0 aspect-square bg-white/80 h-16 w-16 rounded-full"

const buttonVariants = cva(baseStyles, {
    variants: {
        mode: {
            mono:
                "gradient-border text-(--color-gray-500) hover:bg-(--color-gray-50) " +
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            blue_line:
                "border border-(--color-blue-500) text-(--color-blue-500) hover:bg-(--color-blue-50) " +
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        },
    },
    defaultVariants: {
        mode: "mono",
    },
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    ButtonVariantProps & {
    icon?: IconName;
};

export const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>
(
    (
        {
            mode,
            icon,
            className,
            ...props
        },
        ref
    ) => {

        return (
            <button
                ref={ref}
                className={cn(buttonVariants({mode}), className)}
                {...props}
            >
                {icon && <Icon name={icon} size={20} />}
            </button>
        );
    }
);
