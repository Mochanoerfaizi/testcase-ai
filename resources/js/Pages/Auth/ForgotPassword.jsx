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

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    })

    const submit = (e) => {
        e.preventDefault()
        post(route("password.email"))
    }

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Text mb={4} fontSize="sm" color="fg.muted">
                Forgot your password? No problem. Just let us know your email address
                and we will email you a password reset link that will allow you to
                choose a new one.
            </Text>

            {status && (
                <Text mb={4} fontSize="sm" fontWeight="medium" color="green.600">
                    {status}
                </Text>
            )}

            <VStack as="form" onSubmit={submit} align="stretch" spacing={4}>
                <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoFocus
                    />
                    {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                </Field.Root>

                <HStack justify="flex-end" mt={4}>
                    <Button type="submit" colorPalette="blue" loading={processing}>
                        Email Password Reset Link
                    </Button>
                </HStack>
            </VStack>
        </GuestLayout>
    )
}
