import { Head } from "@inertiajs/react"


import { Box, Container, VStack } from "@chakra-ui/react"

import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm"
import UpdatePasswordForm from "./Partials/UpdatePasswordForm"
import DeleteUserForm from "./Partials/DeleteUserForm"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <Box py={12}>
                <Container maxW="7xl" px={{ base: 0, sm: 6, lg: 8 }}>
                    <VStack spacing={6} align="stretch">
                        <Box bg="white" p={{ base: 4, sm: 8 }} shadow="sm" rounded={{ sm: "lg" }}>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </Box>

                        <Box bg="white" p={{ base: 4, sm: 8 }} shadow="sm" rounded={{ sm: "lg" }}>
                            <UpdatePasswordForm className="max-w-xl" />
                        </Box>

                        <Box bg="white" p={{ base: 4, sm: 8 }} shadow="sm" rounded={{ sm: "lg" }}>
                            <DeleteUserForm className="max-w-xl" />
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </AuthenticatedLayout>
    )
}
