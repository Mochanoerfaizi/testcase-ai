"use client"

import { Field } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

export default function FormInput({ name, label,required, children }) {
    const {
        formState: { errors },
    } = useFormContext()

    const errorMessage = errors?.[name]?.message

    return (
        <Field.Root invalid={!!errorMessage} required={required}>
            {label && <Field.Label>{label} <Field.RequiredIndicator /></Field.Label>}
            {children}
            {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
        </Field.Root>
    )
}
