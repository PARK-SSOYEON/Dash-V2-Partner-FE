import React from "react";

type SlideSelectorProps = {
    options: string[];
    value: string;
    onChange: (next: string) => void;
    className?: string;
    disabledOptions?: string[];
};

export const SlideSelector: React.FC<SlideSelectorProps> = ({ options, value, onChange, className, disabledOptions }) => {
    const [pressed, setPressed] = React.useState<string | null>(null);
    const [shakeX, setShakeX] = React.useState(0);

    const activeIndex = Math.max(0, options.findIndex((o) => o === value));
    const pressedIndex = pressed ? options.findIndex((o) => o === pressed) : -1;
    const highlightIndex = pressedIndex !== -1 ? pressedIndex : activeIndex;


    return (
        <nav
            className={
                "relative rounded-full bg-white border border-(--color-gray-300) px-1 py-1 " +
                (className ?? "")
            }
            aria-label="Slide selector"
        >
            <ul className="grid h-12 w-full items-stretch relative" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
                {(
                    <span
                        aria-hidden
                        className={
                            "absolute top-1/2 left-0 pointer-events-none rounded-full " +
                            " transition-[left,transform,opacity,background-color,box-shadow] duration-250 ease-[cubic-bezier(0.34,1.2,0.68,1)] will-change-[left,transform,opacity] bg-(--color-blue-500)"
                        }
                        style={{
                            width: `min(180px, calc(100%/${options.length} - 12px))`,
                            height: "43px",
                            left: `calc(${Math.max(0, highlightIndex)} * (100% / ${options.length}) + (50% / ${options.length}))`,
                            // combine the center translate with shake using a CSS var
                            transform: `translate(calc(-50% + var(--shake-x, 0px)), -50%)`,
                            // feed the CSS var from state
                            ['--shake-x' as any]: `${shakeX}px`,
                        }}
                    />
                )}

                {options.map((opt) => {
                    const isActive = opt === value;
                    const isOptPressed = pressed === opt;
                    const hasPressed = pressed !== null;
                    const baseClass = "font-bold text-base"
                    const isDisabled = Array.isArray(disabledOptions) && disabledOptions.includes(opt);

                    const colorClass = isDisabled
                        ? "text-(--color-gray-400)"
                        : (hasPressed ? (isOptPressed ? "text-white" : "text-(--color-gray-600)") : (isActive ? "text-white" : "text-gray-600"));

                    return (
                        <li key={opt} className="flex">
                            <button
                                type="button"
                                className={
                                    "relative z-10 grid place-items-center w-full rounded-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-blue-400) " +
                                    (isDisabled ? "cursor-not-allowed opacity-60" : "")
                                }
                                aria-pressed={isActive}
                                aria-disabled={isDisabled}
                                onPointerDown={() => {
                                    if (isDisabled) {
                                        const targetIdx = options.findIndex((o) => o === opt);
                                        const dir = Math.sign(targetIdx - activeIndex) || 1;
                                        setShakeX(10 * dir);
                                        window.setTimeout(() => setShakeX(0), 120);
                                        return;
                                    }
                                    setPressed(opt);
                                }}
                                onPointerUp={() => setPressed(null)}
                                onPointerLeave={() => setPressed(null)}
                                onPointerCancel={() => setPressed(null)}
                                onClick={(e) => {
                                    if (isDisabled) {
                                        e.preventDefault();
                                        return;
                                    }
                                    onChange(opt);
                                }}
                            >
                                <span
                                    className={`${colorClass} ${baseClass} transition-colors duration-300`}>{opt}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
