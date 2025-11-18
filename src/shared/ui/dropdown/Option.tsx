import React from 'react';
import { cva } from 'class-variance-authority';
import {cn} from "../../lib/cn.ts";

interface OptionProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const optionVariants = cva(
    'p-5 text-base font-semibold rounded-full cursor-pointer  transition-colors bg-white/60',
    {
        variants: {
            isSelected: {
                true: 'border border-(--color-blue-500) text-(--color-blue-500)',
                false: 'hover:bg-gray-100 gradient-border text-black/30',
            },
        },
        defaultVariants: {
            isSelected: false,
        },
    }
);

export const Option: React.FC<OptionProps> = ({ label, isSelected, onClick }) => {
    return (
        <div
            className={cn(
                optionVariants({ isSelected }),
                'flex items-center justify-between',
            )}
            onClick={onClick}
        >
            <span>{label}</span>
        </div>
    );
};
