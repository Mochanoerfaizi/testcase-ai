import { UsersMock } from "@/Mock/users.mock"

export async function FetchMock({
    pageIndex,
    pageSize,
    sortBy,
    sortDir,
    search,
}) {
    let filtered = [...UsersMock]

    // Global filter
    if (search) {
        filtered = filtered.filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                u.role.toLowerCase().includes(search.toLowerCase())
        )
    }

    // Sorting
    if (sortBy) {
        filtered.sort((a, b) => {
            const valA = a[sortBy]
            const valB = b[sortBy]
            if (valA < valB) return sortDir === "asc" ? -1 : 1
            if (valA > valB) return sortDir === "asc" ? 1 : -1
            return 0
        })
    }

    // Pagination
    const start = pageIndex * pageSize
    const end = start + pageSize
    const paginated = filtered.slice(start, end)

    const totalPages = Math.ceil(filtered.length / pageSize)

    // Simulasikan delay API
    await new Promise((r) => setTimeout(r, 500))

    return {
        data: paginated,
        totalPages,
    }
}
