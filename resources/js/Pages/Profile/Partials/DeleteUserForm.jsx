"use client"

import { useForm } from "@inertiajs/react"
import { useRef, useState } from "react"
import {
    Box,
    Button,
    Field,
    Input,
    Text,
    VStack,
    Dialog,
    HStack,
} from "@chakra-ui/react"

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false)
    const passwordInput = useRef()

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    })

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true)
    }

    const deleteUser = (e) => {
        e.preventDefault()

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        })
    }

    const closeModal = () => {
        setConfirmingUserDeletion(false)
        clearErrors()
        reset()
    }

    return (
        <VStack align="stretch" spacing={6} className={className}>
            <Box>
                <Text fontSize="lg" fontWeight="medium" color="fg">
                    Delete Account
                </Text>
                <Text fontSize="sm" color="fg.muted" mt={1}>
                    Once your account is deleted, all of its resources and data will be
                    permanently deleted. Before deleting your account, please download any
                    data or information that you wish to retain.
                </Text>
            </Box>

            {/* Trigger */}
            <Button colorPalette="red" onClick={confirmUserDeletion}>
                Delete Account
            </Button>

            {/* Dialog */}
            <Dialog.Root open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Box as="form" onSubmit={deleteUser} p={6}>
                            <Dialog.Title fontSize="lg" fontWeight="medium" color="fg">
                                Are you sure you want to delete your account?
                            </Dialog.Title>
                            <Dialog.Description mt={2} fontSize="sm" color="fg.muted">
                                Once your account is deleted, all of its resources and data will
                                be permanently deleted. Please enter your password to confirm
                                you would like to permanently delete your account.
                            </Dialog.Description>

                            {/* Password field */}
                            <Field.Root invalid={!!errors.password} mt={6}>
                                <Field.Label className="sr-only">Password</Field.Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="Password"
                                    w="3/4"
                                    autoFocus
                                />
                                {errors.password && (
                                    <Field.ErrorText>{errors.password}</Field.ErrorText>
                                )}
                            </Field.Root>

                            {/* Actions */}
                            <HStack justify="flex-end" spacing={3} mt={6}>
                                <Button variant="outline" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button type="submit" colorPalette="red" loading={processing}>
                                    Delete Account
                                </Button>
                            </HStack>
                        </Box>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </VStack>
    )
}
