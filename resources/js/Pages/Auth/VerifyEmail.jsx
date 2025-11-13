"use client"

import { Head, Link, useForm } from "@inertiajs/react"
import {
    Box,
    Text,
    Button,
    HStack,
} from "@chakra-ui/react"
import GuestLayout from "@/Layouts/GuestLayout"

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({})

    const submit = (e) => {
        e.preventDefault()
        post(route("verification.send"))
    }

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Text mb={4} fontSize="sm" color="fg.muted">
                Thanks for signing up! Before getting started, could you verify your
                email address by clicking on the link we just emailed to you? If you
                didn&apos;t receive the email, we will gladly send you another.
            </Text>

            {status === "verification-link-sent" && (
                <Text mb={4} fontSize="sm" fontWeight="medium" color="green.600">
                    A new verification link has been sent to the email address you
                    provided during registration.
                </Text>
            )}

            <Box as="form" onSubmit={submit}>
                <HStack mt={4} justify="space-between">
                    <Button type="submit" colorPalette="blue" loading={processing}>
                        Resend Verification Email
                    </Button>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        style={{ textDecoration: "underline" }}
                    >
                        <Text
                            as="span"
                            fontSize="sm"
                            color="fg.muted"
                            _hover={{ color: "fg" }}
                        >
                            Log Out
                        </Text>
                    </Link>
                </HStack>
            </Box>
        </GuestLayout>
    )
}
