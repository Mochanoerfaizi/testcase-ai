"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {cleanParams} from "@/Utils/params-cleaner.js";
import {buildQuery} from "@/Utils/query-builder.js";
import {api} from "@/Utils/api-client.js";
import axios from "axios"

// Hook
export function useDataProducers(params = {}, options = {}) {
    return useQuery({
        queryKey: ["data-producers", JSON.stringify(params)],
        queryFn: async () => {
            const cleaned = cleanParams(params)
            const queryString = buildQuery(cleaned)
            const { data } = await api.get(
                `/data-producers/json${queryString ? `?${queryString}` : ""}`
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

// ✅ Create
export function useCreateDataProducer(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload) => {
            const endpoint = route("data-producers.store")
            const { data } = await axios.post(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["data-producers"])
        },
        ...options,
    })
}

// ✅ Update
export function useUpdateDataProducer(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const endpoint = route("data-producers.update", id)
            const { data } = await axios.put(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["data-producers"])
        },
        ...options,
    })
}

// ✅ Delete
export function useDeleteDataProducer(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id) => {
            const endpoint = route("data-producers.destroy", id)
            const { data } = await axios.delete(endpoint, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["data-producers"])
        },
        ...options,
    })
}

