import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Box, Container, Heading, Button } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import RoleTable from "./partials/RoleTable";
import RoleForm from "./partials/RoleForm";

export default function RoleManagement() {
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState(null);

    const handleAddRole = () => {
        setSelectedRole(null);
        setIsFormOpen(true);
    };

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedRole(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Role Management" />
            <Container maxW="container.xl" py={8}>
                <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
                    <Heading size="lg">Role Management</Heading>
                    <Button
                        colorScheme="blue"
                        leftIcon={<LuPlus />}
                        onClick={handleAddRole}
                    >
                        Add Role
                    </Button>
                </Box>

                <RoleTable onEdit={handleEditRole} />

                <RoleForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    role={selectedRole}
                />
            </Container>
        </AuthenticatedLayout>
    );
}
