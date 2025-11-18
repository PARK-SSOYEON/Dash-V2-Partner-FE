import * as React from "react";
import {NavLink, useLocation} from "react-router-dom";
import type {IconName} from "../../shared/ui/icons/IconRegistry.ts";
import {Icon} from "../../shared/ui/Icon.tsx";

type Item = {
    to: string;
    icon: IconName;
};

const items: Item[] = [
    {to: "/coupon", icon: "coupon"},
    {to: "/issue", icon: "issue"},
    {to: "/notice", icon: "notification"},
    {to: "/settings", icon: "profile"},
];

type BottomMenuProps = {
    visible?: boolean;
};

export const BottomMenu = React.memo(function BottomMenu({visible=true}: BottomMenuProps) {
    const [pressedKey, setPressedKey] = React.useState<string | null>(null);

    const location = useLocation();
    const activeIndex = items.findIndex((i) => location.pathname.startsWith(i.to));
    const pressedIndex = pressedKey ? items.findIndex((i) => i.to === pressedKey) : -1;
    const highlightIndex = pressedIndex !== -1 ? pressedIndex : activeIndex; // slide to touch, then stay when active updates
    const showIndicator = highlightIndex >= 0;
    const isPressed = pressedIndex !== -1;

    return (
        <nav
            className={"fixed left-1/2 -translate-x-1/2 rounded-full bg-white/60 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md shadow-[0_0_2px_rgba(0,0,0,0.25)] z-[100] px-4 pointer-events-none"+
                "transition-transform duration-300 ease-out " +
                (visible ? " translate-y-0 " : " translate-y-[150%] ")
            }
            style={{
                width: "min(calc(100vw - (var(--gutter,24px) * 2)), calc(var(--container-max,450px) - (var(--gutter,24px) * 2)))",
                bottom: "max(1.5rem, env(safe-area-inset-bottom))",
                height: "var(--bottom-nav-h,66px)",
            }}
        >
            <ul className="grid grid-cols-4 h-full w-full relative">
                {(
                    <span
                        className={
                            "absolute top-1/2 left-0 pointer-events-none rounded-full " +
                            (showIndicator ? " opacity-30 " : " opacity-0 ") +
                            " transition-[left,transform,opacity,background-color,box-shadow] duration-250 ease-[cubic-bezier(0.34,1.26,0.64,1)] will-change-[left,transform,opacity] " +
                            (isPressed ? " bg-white shadow-[0_0_6px_rgba(0,0,0,0.25)] " : " bg-(--color-gray-200) ")
                        }
                        style={{
                            width: "92px", // w-[92px]
                            height: "56px", // h-[56px]
                            left: `calc(${Math.max(0, highlightIndex)} * 25% + 12.5%)`,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                )}
                {items.map(({to, icon}) => (
                    <li key={to} className="flex">
                        <NavLink
                            to={to}
                            className="flex-1 flex items-center justify-center"
                        >
                            {({isActive}) => {
                                const isPressed = pressedKey === to;
                                const hasPressed = pressedKey !== null;
                                const iconClass = hasPressed
                                    ? (isPressed ? "text-(--color-blue-500)" : "text-black")
                                    : (isActive ? "text-(--color-blue-500)" : "text-black");

                                return (
                                    <button
                                        type="button"
                                        className={
                                            "relative grid place-items-center w-16 h-full focus:outline-none pointer-events-auto"
                                        }
                                        onPointerDown={() => setPressedKey(to)}
                                        onPointerUp={() => setPressedKey(null)}
                                        onPointerLeave={() => setPressedKey(null)}
                                        onPointerCancel={() => setPressedKey(null)}
                                        onContextMenu={(e) => e.preventDefault()}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <span className={"relative z-10 " + iconClass}>
                                            <Icon name={icon} size={32} />
                                        </span>
                                    </button>
                                );
                            }}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
});
