"use client"

import { Head, useForm } from "@inertiajs/react"
import {
    Box,
    VStack,
    Field,
    Input,
    Button,
    Text,
    HStack,
} from "@chakra-ui/react"
import GuestLayout from "@/Layouts/GuestLayout"

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    })

    const submit = (e) => {
        e.preventDefault()
        post(route("password.store"))
    }

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <VStack as="form" onSubmit={submit} align="stretch" spacing={6}>
                {/* Email */}
                <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="username"
                    />
                    {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                </Field.Root>

                {/* Password */}
                <Field.Root invalid={!!errors.password}>
                    <Field.Label>Password</Field.Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoComplete="new-password"
                    />
                    {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
                </Field.Root>

                {/* Confirm Password */}
                <Field.Root invalid={!!errors.password_confirmation}>
                    <Field.Label>Confirm Password</Field.Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <Field.ErrorText>{errors.password_confirmation}</Field.ErrorText>
                    )}
                </Field.Root>

                {/* Actions */}
                <HStack justify="flex-end">
                    <Button type="submit" colorPalette="blue" loading={processing}>
                        Reset Password
                    </Button>
                </HStack>
            </VStack>
        </GuestLayout>
    )
}
