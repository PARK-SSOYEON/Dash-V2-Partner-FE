// features/couponPublish/model/useProductSuggestions.ts
import { useQuery } from "@tanstack/react-query";
import type {ProductSuggestion} from "./types.ts";
import type {ApiError} from "../../../shared/types/api.ts";
import {searchProducts} from "../api/searchProducts.ts";


interface UseProductSuggestionsParams {
    partnerId: string;
    keyword: string;
    size?: number;
}

export function useProductSuggestions({
                                          partnerId,
                                          keyword,
                                          size,
                                      }: UseProductSuggestionsParams) {
    const trimmed = keyword.trim();

    return useQuery<ProductSuggestion[], ApiError>({
        queryKey: ["productSuggestions", partnerId, trimmed, size],
        queryFn: async () => {
            const res = await searchProducts({
                partnerId,
                keyword: trimmed,
                size,
            });

            return res.items.map((item) => ({
                productId: item.productId,
                name: item.productName,
            }));
        },
        enabled: !!partnerId && trimmed.length > 0, // 검색어 없으면 호출 안 함
    });
}
