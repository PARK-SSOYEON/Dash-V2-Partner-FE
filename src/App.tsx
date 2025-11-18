import {Outlet, useLocation} from "react-router-dom";
import Layout from "./app/widget/layout.tsx";
import {BottomMenu} from "./app/widget/BottomMenu.tsx";
import {LoginBlob} from "./shared/ui/backgroud/LoginBlob.tsx";
import {useUIStore} from "./shared/store/uiStore.ts";

function App() {
    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const isSign = location.pathname ==="/sign";

    const bottomMenuVisible = useUIStore((s) => s.bottomMenuVisible);

    return (
        <>
            {(isLogin || isSign ) && (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <LoginBlob
                        className="absolute"
                        style={{
                            left: "48%",
                            bottom: "-15%"
                        }}
                    />
                </div>
            )}

            <div
              className="fixed inset-0 z-[0] pointer-events-none flex"
              aria-hidden="true"
            >
              <div className="flex-1 bg-[rgb(245,245,245)]" />
              <div className="w-[450px]" />
              <div className="flex-1 bg-[rgb(245,245,245)]" />
            </div>

            <Layout>
                <Outlet/>
            </Layout>

            <BottomMenu visible={bottomMenuVisible} />
        </>
    )
}

export default App
