"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {cleanParams} from "@/Utils/params-cleaner.js";
import {buildQuery} from "@/Utils/query-builder.js";
import {api} from "@/Utils/api-client.js";
import axios from "axios"

// Hook untuk mengambil data users
export function useUsers(params = {}, options = {}) {
    return useQuery({
        queryKey: ["users", JSON.stringify(params)],
        queryFn: async () => {
            const cleaned = cleanParams(params)
            const queryString = buildQuery(cleaned)
            const { data } = await api.get(
                `/users/json${queryString ? `?${queryString}` : ""}`
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

// Get all roles for user assignment
export function useAllRoles(options = {}) {
    return useQuery({
        queryKey: ["all-roles"],
        queryFn: async () => {
            const { data } = await api.get('/roles/all')
            return data
        },
        ...options,
    })
}

// ✅ Create User
export function useCreateUser(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload) => {
            const endpoint = route("users.store")
            const { data } = await axios.post(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"])
        },
        ...options,
    })
}

// ✅ Update User
export function useUpdateUser(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const endpoint = route("users.update", id)
            const { data } = await axios.put(endpoint, payload, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"])
        },
        ...options,
    })
}

// ✅ Toggle Active Status
export function useToggleUserActive(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id) => {
            const endpoint = route("users.toggle-active", id)
            const { data } = await axios.patch(endpoint, {}, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"])
        },
        ...options,
    })
}

// ✅ Delete User
export function useDeleteUser(options = {}) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id) => {
            const endpoint = route("users.destroy", id)
            const { data } = await axios.delete(endpoint, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"])
        },
        ...options,
    })
}
