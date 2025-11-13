import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head} from "@inertiajs/react";
import {Box, Button, Flex} from "@chakra-ui/react";
import UserTable from "@/Pages/UserManagement/partials/UserTable";
import UserForm from "@/Pages/UserManagement/partials/UserForm";
import {MdAdd} from "react-icons/md";
import {useCreateUser} from "@/Hooks/Services/useUsers.js";
import { toaster } from "@/Components/themes/ui/toaster"

export default function UserManagementPage() {

    const createUser = useCreateUser()

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Management User
                </h2>
            }
        >
            <Head title="Management User"/>

            <>
                <Flex
                    mb={4}
                    justify="space-between"
                    align="center"
                >
                    <Box>
                        {/* Filter placeholder - could be added later */}
                    </Box>

                    <Box>
                        <Button
                            onClick={() => {
                                UserForm.open("create", {
                                    title: "Tambah User",
                                    placement: "center",
                                    isLoading: createUser.isLoading,
                                    onSubmit: (values) => {
                                        createUser.mutate(values, {
                                            onSuccess: () => {
                                                toaster.create({
                                                    title: "Sukses",
                                                    description: "User berhasil ditambahkan",
                                                    type: "success"
                                                })
                                                UserForm.close("create")
                                            },
                                            onError: (error) => {
                                                const message = error?.response?.data?.message || "Gagal menambahkan User!"
                                                toaster.create({
                                                    title: "Gagal",
                                                    description: message,
                                                    status: "error",
                                                    type: "error"
                                                })
                                            },
                                        })
                                    },
                                })
                            }}
                        >
                            <MdAdd /> Tambah User
                        </Button>
                    </Box>
                </Flex>

                <UserTable />

                <UserForm.Viewport />

            </>

        </AuthenticatedLayout>
    )
}
