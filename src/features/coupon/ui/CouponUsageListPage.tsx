import * as React from "react";
import {useUIStore} from "../../../shared/store/uiStore.ts";
import {ListView} from "./ListView.tsx";

export function CouponUsageListPage() {
    const showBottomMenu = useUIStore((s) => s.showBottomMenu);

    React.useEffect(() => {
        showBottomMenu();
    }, []);


    return (
        <div className="flex flex-col pt-4 w-full gap-3">
            <header className="flex items-center justify-between h-17">
                <div className={"flex flex-col"}>
                    <h1 className="text-3xl font-bold tracking-tight text-black">
                        결제 내역
                    </h1>
                </div>
            </header>

            <div className="relative flex-1 w-full">

                <ListView/>

            </div>
        </div>
    )
}
