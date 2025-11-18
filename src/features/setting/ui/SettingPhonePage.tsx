import {SettingLayout} from "./SettingLayout";
import {SettingPhoneForm} from "./SettingPhoneForm.tsx";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import * as React from "react";

export function SettingPhonePage() {
    const hideBottomMenu = useUIStore((s) => s.hideBottomMenu);

    React.useEffect(() => {
        hideBottomMenu();
    }, [hideBottomMenu]);

    return (
        <SettingLayout>
            <SettingPhoneForm/>
        </SettingLayout>
    );
}
