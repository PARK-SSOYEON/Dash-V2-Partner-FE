import {Outlet, useLocation} from "react-router-dom";
import MobileLayout from "./app/widget/mobileLayout.tsx";
import {BottomMenu} from "./app/widget/BottomMenu.tsx";
import {LoginBlob} from "./shared/ui/backgroud/LoginBlob.tsx";
import {useUIStore} from "./shared/store/uiStore.ts";
import TabletLayout from "./app/widget/tabletLayout.tsx";
import {useIsLandscape} from "./shared/hook/useIsLandscape.ts";
import QRPaymentRoute from "./app/routes/QRPayment.tsx";


function App() {
    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const isSign = location.pathname === "/sign";

    const isLandscape = useIsLandscape();

    const bottomMenuVisible = useUIStore((s) => s.bottomMenuVisible);

    return (
        <>
            {(isLogin || isSign) && (
                <>
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                        <LoginBlob
                            className="absolute"
                            style={{
                                width: "90%",
                                left: "55%",
                                bottom: "-30%"
                            }}
                        />
                    </div>

                    {/*<div*/}
                    {/*    className="fixed inset-0 z-[0] pointer-events-none flex"*/}
                    {/*    aria-hidden="true"*/}
                    {/*>*/}
                    {/*    <div className="flex-1 bg-white"/>*/}
                    {/*    <div className="w-[450px]"/>*/}
                    {/*    <div className="flex-1 bg-white"/>*/}
                    {/*</div>*/}


                    <MobileLayout>
                        <Outlet/>
                    </MobileLayout>
                </>
            )}

            {!(isLogin || isSign) && (
                <TabletLayout>
                    {isLandscape ? (
                        <div className="flex h-full gap-16 pt-8">
                            <div className="w-2/3">
                                <Outlet/>
                            </div>
                            <div className="w-1/3">
                                <QRPaymentRoute/>
                            </div>
                        </div>
                    ) : (
                        <Outlet/>
                    )}
                </TabletLayout>
            )}

            < BottomMenu visible={bottomMenuVisible}/>
        </>
    )
}

export default App
