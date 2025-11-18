import {SettingLayout} from "./SettingLayout";
import {MypageSection} from "./MypageSection";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import * as React from "react";

export function SettingHome() {
    const showBottomMenu = useUIStore((s) => s.showBottomMenu);

    React.useEffect(() => {
        showBottomMenu();
    }, [showBottomMenu]);

    return (
        <SettingLayout>
            <MypageSection />
        </SettingLayout>
    );
}
