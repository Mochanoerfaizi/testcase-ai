"use client"

import { useEffect, useState } from "react"

// Helper: parse query string dari URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search)
    const result = {}
    params.forEach((value, key) => {
        result[key] = value
    })
    return result
}

// Helper: update query string ke URL
function setQueryParams(params) {
    const search = new URLSearchParams(
        Object.entries(params).filter(
            ([, v]) =>
                v !== undefined &&
                v !== null &&
                v !== "" &&
                !(Array.isArray(v) && v.length === 0)
        )
    ).toString()

    const newUrl = `${window.location.pathname}${search ? `?${search}` : ""}`
    window.history.replaceState(null, "", newUrl)
}

/**
 * Hook untuk state params yang persist ke URL
 * @param {object} defaultParams - nilai default (page, per_page, dll.)
 * @returns [params, setParams]
 */
export function usePersistedParams(defaultParams = {}) {
    const [params, setParams] = useState(() => ({
        ...defaultParams,
        ...getQueryParams(), // isi dari URL kalau ada
    }))

    useEffect(() => {
        setQueryParams(params)
    }, [params])

    return [params, setParams]
}
