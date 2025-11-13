import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head} from "@inertiajs/react";
import {Box, Button, Flex} from "@chakra-ui/react";
import ProductTable from "@/Pages/ProductManagement/partials/ProductTable";
import ProductForm from "@/Pages/ProductManagement/partials/ProductForm";
import {MdAdd} from "react-icons/md";
import {useCreateProduct} from "@/Hooks/Services/useProducts.js";
import { toaster } from "@/Components/themes/ui/toaster"

export default function ProductManagementPage() {

    const createProduct = useCreateProduct()

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Management Product
                </h2>
            }
        >
            <Head title="Management Product"/>

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
                                ProductForm.open("create", {
                                    title: "Tambah Product",
                                    placement: "center",
                                    isLoading: createProduct.isLoading,
                                    onSubmit: (values) => {
                                        createProduct.mutate(values, {
                                            onSuccess: () => {
                                                toaster.create({
                                                    title: "Sukses",
                                                    description: "Product berhasil ditambahkan",
                                                    type: "success"
                                                })
                                                ProductForm.close("create")
                                            },
                                            onError: (error) => {
                                                const message = error?.response?.data?.message || "Gagal menambahkan Product!"
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
                            <MdAdd /> Tambah Product
                        </Button>
                    </Box>
                </Flex>

                <ProductTable />

                <ProductForm.Viewport />

            </>

        </AuthenticatedLayout>
    )
}
