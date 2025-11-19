import * as React from "react";
import {SettingPinForm} from "./SettingPinForm.tsx";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {SettingLayout} from "./SettingLayout.tsx";

export function SettingPinPage() {
    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);

    React.useEffect(() => {
        hideBottomMenu();
    }, [hideBottomMenu]);

    return (
        <SettingLayout>
            <SettingPinForm/>
        </SettingLayout>
    );
}
