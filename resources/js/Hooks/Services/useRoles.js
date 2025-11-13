"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {cleanParams} from "@/Utils/params-cleaner.js";
import {buildQuery} from "@/Utils/query-builder.js";
import {api} from "@/Utils/api-client.js";
import axios from "axios"

// Hook untuk mengambil data roles
export function useRoles(params = {}, options = {}) {
    return useQuery({
        queryKey: ["roles", JSON.stringify(params)],
        queryFn: async () => {
            const cleaned = cleanParams(params)
            const queryString = buildQuery(cleaned)
            const { data } = await api.get(
                `/roles/json${queryString ? `?${queryString}` : ""}`
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

// Get all permissions for role assignment
export function useAllPermissions(options = {}) {
    return useQuery({
        queryKey: ["all-permissions"],
        queryFn: async () => {
            const { data } = await api.get('/roles/permissions/all')
            return data
        },
        ...options,
    })
}

// ✅ Create Role
export function useCreateRole(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload) => {
            const endpoint = route("roles.store")
            const { data } = await axios.post(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["roles"])
        },
        ...options,
    })
}

// ✅ Update Role
export function useUpdateRole(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const endpoint = route("roles.update", id)
            const { data } = await axios.put(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["roles"])
        },
        ...options,
    })
}

// ✅ Delete Role
export function useDeleteRole(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id) => {
            const endpoint = route("roles.destroy", id)
            const { data } = await axios.delete(endpoint, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["roles"])
        },
        ...options,
    })
}
