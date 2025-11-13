"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {cleanParams} from "@/Utils/params-cleaner.js";
import {buildQuery} from "@/Utils/query-builder.js";
import {api} from "@/Utils/api-client.js";
import axios from "axios"

// Hook untuk mengambil data products
export function useProducts(params = {}, options = {}) {
    return useQuery({
        queryKey: ["products", JSON.stringify(params)],
        queryFn: async () => {
            const cleaned = cleanParams(params)
            const queryString = buildQuery(cleaned)
            const { data } = await api.get(
                `/products/json${queryString ? `?${queryString}` : ""}`
            )

            return {
                rows: data.data,
                totalPages: data?.last_page,
                currentPage: data?.current_page,
                perPage: data.per_page,
                total: data.total,
            }
        },
        keepPreviousData: true,
        ...options,
    })
}

// ✅ Create Product
export function useCreateProduct(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload) => {
            const endpoint = route("products.store")
            const { data } = await axios.post(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"])
        },
        ...options,
    })
}

// ✅ Update Product
export function useUpdateProduct(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const endpoint = route("products.update", id)
            const { data } = await axios.put(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"])
        },
        ...options,
    })
}

// ✅ Delete Product
export function useDeleteProduct(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id) => {
            const endpoint = route("products.destroy", id)
            const { data } = await axios.delete(endpoint, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"])
        },
        ...options,
    })
}
