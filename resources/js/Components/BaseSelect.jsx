"use client"

import React from "react"
import Select from "react-select"

export default function BaseSelect({
                                       options = [],
                                       value,
                                       onChange,
                                       placeholder = "Pilih...",
                                       isClearable = true,
                                       styles = {},
                                       ...props
                                   }) {
    const defaultStyles = {
        control: (base) => ({
            ...base,
            minHeight: "38px",
            borderColor: "#E2E8F0",
            boxShadow: "none",
            backgroundColor: "white",
            "&:hover": { borderColor: "#CBD5E0" },
            fontSize: "11pt",
        }),
        menu: (base) => ({
            ...base,
            zIndex: 10,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#EDF2F7" : "white",
            color: "#1A202C",
        }),
        ...styles,
    }

    return (
        <Select
            options={options}
            value={options.find((opt) => opt.value === value) || null}
            onChange={(selected) => onChange(selected?.value || null)}
            placeholder={placeholder}
            styles={defaultStyles}
            isClearable={isClearable}
            {...props}
        />
    )
}
