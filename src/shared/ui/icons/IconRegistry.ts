import {IcIdentify} from "./IcIdentify";
import {IcLeftArrow} from "./IcLeftArrow";
import {IcRightArrow} from "./IcRightArrow";
import {IcTrashcan} from "./IcTrashcan";
import {IcCoupon} from "./IcCoupon";
import {IcIssue} from "./IcIssue";
import {IcNotification} from "./IcNotification";
import {IcProfile} from "./IcProfile";
import {IcRight} from "./IcRight.tsx";
import {IcDownChevron} from "./IcDownChevron.tsx";
import {IcUpChevron} from "./IcUpChevron.tsx";
import {IcRightChevron} from "./IcRightChevron.tsx";
import {IcSelect} from "./IcSelect.tsx";
import {IcFilter} from "./IcFilter.tsx";
import {IcLeftChevron} from "./IcLeftChevron.tsx";
import {IcAddCoupon} from "./IcAddCoupon.tsx";
import {IcCheck} from "./IcCheck.tsx";
import {IcList} from "./IcList.tsx";
import {IcLock} from "./IcLock.tsx";
import {IcWarning} from "./IcWarning.tsx";

export const IconRegistry = {
    identify: IcIdentify,
    leftArrow: IcLeftArrow,
    rightArrow: IcRightArrow,
    downChevron: IcDownChevron,
    upChevron: IcUpChevron,
    rightChevron: IcRightChevron,
    leftChevron: IcLeftChevron,
    trashcan: IcTrashcan,
    coupon: IcCoupon,
    issue: IcIssue,
    notification: IcNotification,
    profile: IcProfile,
    right: IcRight,
    select: IcSelect,
    filter: IcFilter,
    list: IcList,
    addCoupon: IcAddCoupon,
    check: IcCheck,
    lock: IcLock,
    warning: IcWarning
}

export type IconName = keyof typeof IconRegistry
