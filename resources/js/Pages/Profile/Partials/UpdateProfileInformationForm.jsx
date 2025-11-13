"use client"

import { Link, useForm, usePage } from "@inertiajs/react"
import {
    Box,
    VStack,
    Field,
    Input,
    Button,
    Text,
    HStack,
} from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"

export default function UpdateProfileInformation({
                                                     mustVerifyEmail,
                                                     status,
                                                     className = "",
                                                 }) {
    const user = usePage().props.auth.user

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        })

    const submit = (e) => {
        e.preventDefault()
        patch(route("profile.update"))
    }

    return (
        <Box as="section" className={className}>
            <Box>
                <Text fontSize="lg" fontWeight="medium" color="fg">
                    Profile Information
                </Text>
                <Text fontSize="sm" color="fg.muted" mt={1}>
                    Update your account&apos;s profile information and email address.
                </Text>
            </Box>

            <VStack
                as="form"
                onSubmit={submit}
                spacing={6}
                align="stretch"
                mt={6}
            >
                {/* Name */}
                <Field.Root invalid={!!errors.name}>
                    <Field.Label>Name</Field.Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        autoComplete="name"
                        autoFocus
                    />
                    {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                </Field.Root>

                {/* Email */}
                <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                </Field.Root>

                {/* Email verification notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <Box>
                        <Text fontSize="sm" color="fg" mt={2}>
                            Your email address is unverified.{" "}
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                style={{
                                    textDecoration: "underline",
                                    fontSize: "0.875rem",
                                    color: "var(--chakra-colors-fg-muted)",
                                }}
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </Text>

                        {status === "verification-link-sent" && (
                            <Text fontSize="sm" fontWeight="medium" color="green.600" mt={2}>
                                A new verification link has been sent to your email address.
                            </Text>
                        )}
                    </Box>
                )}

                {/* Actions */}
                <HStack align="center" spacing={4}>
                    <Button type="submit" colorPalette="blue" loading={processing}>
                        Save
                    </Button>

                    <AnimatePresence>
                        {recentlySuccessful && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Text fontSize="sm" color="fg.muted">
                                    Saved.
                                </Text>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </HStack>
            </VStack>
        </Box>
    )
}
