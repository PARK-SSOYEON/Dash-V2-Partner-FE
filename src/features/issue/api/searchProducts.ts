import {apiClient} from "../../../shared/lib/apiClient.ts";
import type {ApiError} from "../../../shared/types/api.ts";

export interface SearchProductsResponseItem {
    productId: number;
    productName: string;
}

export interface SearchProductsResponse {
    items: SearchProductsResponseItem[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface SearchProductsParams {
    partnerId: string;
    keyword: string;
    size?: number;
}

export async function searchProducts({
                                         partnerId,
                                         keyword,
                                         size = 20,
                                     }: SearchProductsParams): Promise<SearchProductsResponse> {
    try {
        const res = await apiClient.get<SearchProductsResponse>(
            `/products/${partnerId}`,
            {
                params: {
                    keyword,
                    size,
                },
                requireAuth: true,
            }
        );

        return res.data;
    } catch (err: any) {
        const status: number | undefined = err?.response?.status;
        const data = err?.response?.data as ApiError | undefined;

        if (status === 401) {
            throw {
                message: "로그인 정보가 올바르지 않습니다.",
                code: "ERR-AUTH",
            } as ApiError;
        }

        if (status === 400 && data?.code === "ERR-IVD-VALUE") {
            throw {
                message: "검색어가 비어있습니다.",
                code: data.code,
            } as ApiError;
        }

        throw {
            message: "상품 목록을 불러오지 못했습니다.",
            code: data?.code,
        } as ApiError;
    }
}
