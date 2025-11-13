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

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    })

    const submit = (e) => {
        e.preventDefault()
        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        })
    }

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <Text mb={4} fontSize="sm" color="fg.muted">
                This is a secure area of the application. Please confirm your password
                before continuing.
            </Text>

            <VStack as="form" onSubmit={submit} align="stretch" spacing={6}>
                {/* Password Field */}
                <Field.Root invalid={!!errors.password}>
                    <Field.Label>Password</Field.Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoFocus
                    />
                    {errors.password && (
                        <Field.ErrorText>{errors.password}</Field.ErrorText>
                    )}
                </Field.Root>

                {/* Actions */}
                <HStack justify="flex-end">
                    <Button type="submit" colorPalette="blue" loading={processing}>
                        Confirm
                    </Button>
                </HStack>
            </VStack>
        </GuestLayout>
    )
}
