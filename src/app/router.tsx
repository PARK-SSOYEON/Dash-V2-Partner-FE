import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../App.tsx";

import LoginRoute from "./routes/Login";
import SignRoute from "./routes/Sign.tsx";
import IssueRoute from "./routes/Issue.tsx";
import IssueDetailRoute from "./routes/IssueDetailView.tsx";
import SettingsRoute from "./routes/Settings.tsx";
import SettingPhoneRoute from "./routes/SettingPhone.tsx";
import NotificationRoute from "./routes/Notification.tsx";
import {PublicRoute} from "./routes/PublicRoute.tsx";
import CouponWrappertRoute from "./routes/CouponWrapper.tsx";
import CouponPublishRoute from "./routes/CouponPublish.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />,
            },
            {
                path: "login", element: (
                    <PublicRoute>
                        <LoginRoute/>
                    </PublicRoute>
                )
            },
            {
                path: "sign", element: (
                    <PublicRoute>
                        <SignRoute/>
                    </PublicRoute>
                )
            },
            {path: "coupon", element: <CouponWrappertRoute/>},
            {path: "issue", element: <IssueRoute/>},
            {path: "issue/new", element: <CouponPublishRoute/>},
            {path: "issue/:id", element: <IssueDetailRoute/>},
            {path: "notice", element: <NotificationRoute/>},
            {path: "settings", element: <SettingsRoute/>},
            {path: "settings/phone", element: <SettingPhoneRoute/>},
        ],
    },
]);
