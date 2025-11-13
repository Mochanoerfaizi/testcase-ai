"use client"

import { useForm } from "@inertiajs/react"
import { useRef } from "react"
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

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef()
    const currentPasswordInput = useRef()

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    })

    const updatePassword = (e) => {
        e.preventDefault()

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation")
                    passwordInput.current?.focus()
                }

                if (errors.current_password) {
                    reset("current_password")
                    currentPasswordInput.current?.focus()
                }
            },
        })
    }

    return (
        <Box as="section" className={className}>
            <Box>
                <Text fontSize="lg" fontWeight="medium" color="fg">
                    Update Password
                </Text>
                <Text fontSize="sm" color="fg.muted" mt={1}>
                    Ensure your account is using a long, random password to stay secure.
                </Text>
            </Box>

            <VStack
                as="form"
                onSubmit={updatePassword}
                spacing={6}
                align="stretch"
                mt={6}
            >
                {/* Current Password */}
                <Field.Root invalid={!!errors.current_password}>
                    <Field.Label>Current Password</Field.Label>
                    <Input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData("current_password", e.target.value)}
                        type="password"
                        autoComplete="current-password"
                    />
                    {errors.current_password && (
                        <Field.ErrorText>{errors.current_password}</Field.ErrorText>
                    )}
                </Field.Root>

                {/* New Password */}
                <Field.Root invalid={!!errors.password}>
                    <Field.Label>New Password</Field.Label>
                    <Input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <Field.ErrorText>{errors.password}</Field.ErrorText>
                    )}
                </Field.Root>

                {/* Confirm Password */}
                <Field.Root invalid={!!errors.password_confirmation}>
                    <Field.Label>Confirm Password</Field.Label>
                    <Input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <Field.ErrorText>{errors.password_confirmation}</Field.ErrorText>
                    )}
                </Field.Root>

                {/* Actions */}
                <HStack spacing={4} align="center">
                    <Button type="submit" colorPalette="blue" loading={processing}>
                        Save
                    </Button>

                    {/* Success Message */}
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
