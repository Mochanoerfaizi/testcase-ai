import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Box, Container, Heading, Button } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import PermissionTable from "./partials/PermissionTable";
import PermissionForm from "./partials/PermissionForm";

export default function PermissionManagement() {
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedPermission, setSelectedPermission] = React.useState(null);

    const handleAddPermission = () => {
        setSelectedPermission(null);
        setIsFormOpen(true);
    };

    const handleEditPermission = (permission) => {
        setSelectedPermission(permission);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedPermission(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Permission Management" />
            <Container maxW="container.xl" py={8}>
                <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
                    <Heading size="lg">Permission Management</Heading>
                    <Button
                        colorScheme="blue"
                        leftIcon={<LuPlus />}
                        onClick={handleAddPermission}
                    >
                        Add Permission
                    </Button>
                </Box>

                <PermissionTable onEdit={handleEditPermission} />

                <PermissionForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    permission={selectedPermission}
                />
            </Container>
        </AuthenticatedLayout>
    );
}
