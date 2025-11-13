"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {cleanParams} from "@/Utils/params-cleaner.js";
import {buildQuery} from "@/Utils/query-builder.js";
import {api} from "@/Utils/api-client.js";
import axios from "axios"

// Hook untuk mengambil data permissions
export function usePermissions(params = {}, options = {}) {
    return useQuery({
        queryKey: ["permissions", JSON.stringify(params)],
        queryFn: async () => {
            const cleaned = cleanParams(params)
            const queryString = buildQuery(cleaned)
            const { data } = await api.get(
                `/permissions/json${queryString ? `?${queryString}` : ""}`
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

// ✅ Create Permission
export function useCreatePermission(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload) => {
            const endpoint = route("permissions.store")
            const { data } = await axios.post(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["permissions"])
            queryClient.invalidateQueries(["all-permissions"])
        },
        ...options,
    })
}

// ✅ Update Permission
export function useUpdatePermission(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const endpoint = route("permissions.update", id)
            const { data } = await axios.put(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["permissions"])
            queryClient.invalidateQueries(["all-permissions"])
        },
        ...options,
    })
}

// ✅ Delete Permission
export function useDeletePermission(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id) => {
            const endpoint = route("permissions.destroy", id)
            const { data } = await axios.delete(endpoint, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["permissions"])
            queryClient.invalidateQueries(["all-permissions"])
        },
        ...options,
    })
}
