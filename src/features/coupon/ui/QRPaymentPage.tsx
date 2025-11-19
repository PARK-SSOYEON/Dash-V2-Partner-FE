import * as React from "react";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {QRScanCard} from "./QRScanCard.tsx";
import {ToggleButton} from "../../../shared/ui/buttons/ToggleButton.tsx";
import {useIsLandscape} from "../../../shared/hook/useIsLandscape.ts";
import {ListView} from "./ListView.tsx";
import {cn} from "../../../shared/lib/cn.ts";
import {Icon} from "../../../shared/ui/Icon.tsx";

export function QRPaymentPage() {
    const showBottomMenu = useUIStore((s) => s.showBottomMenu);

    React.useEffect(() => {
        showBottomMenu();
    }, []);

    const isLandScape = useIsLandscape();

    const [listMode, setListMode] = React.useState(false);
    const [isRearCamera, setIsRearCamera] = React.useState<boolean>(false);


    return (
        <div className="flex flex-col pt-4 w-full gap-3">
            <header className="flex items-center justify-between h-17">
                <div className={"flex flex-col"}>
                    <h1 className="text-3xl font-bold tracking-tight text-black">
                        결제
                    </h1>
                </div>

                {!isLandScape && (
                    <ToggleButton
                        leftIcon={"camera"}
                        rightIcon={"list"}
                        onChange={(value) => {
                            // null | "left" | "right"
                            if (value === "right") {
                                setIsRearCamera(false);
                                setListMode(true);
                            } else if (value === "left") {
                                setIsRearCamera(true);
                                setListMode(false);
                            } else {
                                setIsRearCamera(false);
                                setListMode(false);
                            }
                        }}
                    />
                ) }

                {isLandScape && (
                    <button
                        className={"relative flex p-2 items-center rounded-full border border-slate-200 bg-white shadow-sm"}
                        onClick={()=>setIsRearCamera(!isRearCamera)}
                    >
                        <Icon name={"camera"} size={24}/>
                    </button>
                )}

            </header>

            <div className="relative flex-1 w-full">
                <QRScanCard/>
                {listMode && (
                    <div className="absolute inset-0 flex w-full justify-center pointer-events-none z-10">
                        <div
                            className="pointer-events-auto w-full"
                        >
                            <ListView/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
