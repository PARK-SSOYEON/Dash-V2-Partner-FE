import type { CouponProduct } from "../model/types";

interface CouponInfoProps {
    product?: CouponProduct;
}

export const CouponInfo: React.FC<CouponInfoProps> = ({ product }) => {
    if (!product) return null;

    return (
        <div className="flex flex-col w-full mt-6 justify-start text-left gap-2">
            <p className="font-bold text-lg text-black truncate">{product.productName}</p>
            <p className="font-medium text-base text-black/60">{product.partnerName}</p>
            <p className="font-medium text-base text-black/60">
                유효 기간 ~{product.expiredAt}
            </p>
        </div>
    );
};
