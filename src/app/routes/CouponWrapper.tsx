// @ts-ignore
import { CouponUsageListPage, QRPaymentPage } from "@features/coupon";
import {useIsLandscape} from "../../shared/hook/useIsLandscape.ts";

export default function CouponWrappertRoute() {
    const isLandscape = useIsLandscape();

    return isLandscape ? <CouponUsageListPage /> : <QRPaymentPage />;
}
