"use client"

import {useQuery} from "@tanstack/react-query"
import {api} from "@/Utils/api-client.js";

// Hook untuk mengambil Taiga projects
export function useTaigaProjects(options = {}) {
    return useQuery({
        queryKey: ["taiga-projects"],
        queryFn: async () => {
            const { data } = await api.get('/api/taiga/projects')
            return data.data || []
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    })
}
