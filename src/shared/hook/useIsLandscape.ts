import {useEffect, useState} from "react";

export function useIsLandscape() {
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const mql = window.matchMedia("(orientation: landscape)");

        const handleChange = (event: MediaQueryListEvent) => {
            setIsLandscape(event.matches);
        };

        setIsLandscape(mql.matches);
        mql.addEventListener("change", handleChange);

        return () => {
            mql.removeEventListener("change", handleChange);
        };
    }, []);

    return isLandscape;
}
