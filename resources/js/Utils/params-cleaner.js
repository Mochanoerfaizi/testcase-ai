export function cleanParams(params = {}) {
    const cleaned = {}
    Object.entries(params).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
        ) {
            cleaned[key] = value
        }
    })
    return cleaned
}
