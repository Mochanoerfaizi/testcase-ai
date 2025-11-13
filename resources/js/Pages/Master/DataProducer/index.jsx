import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head} from "@inertiajs/react";
import {Box, Button, Flex} from "@chakra-ui/react";
import DataProducerTable from "@/Pages/Master/DataProducer/partials/DataProducerTable";
import DataProducerForm from "@/Pages/Master/DataProducer/partials/DataProducerForm";
import {MdAdd} from "react-icons/md";
import {useCreateDataProducer} from "@/Hooks/Services/useDataProducers.js";
import { toaster } from "@/Components/themes/ui/toaster"

export default function DataProducerPage() {

    const createDataProducer = useCreateDataProducer()

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Produsen Data
                </h2>
            }
        >
            <Head title="Master - Produsen Data"/>

            <>
                <Flex
                    mb={4}
                    justify="space-between"
                    align="center"
                >
                    <Box>
                        Filter
                    </Box>

                    <Box>
                        <Button
                            onClick={() => {
                                DataProducerForm.open("create", {
                                    title: "Tambah Produsen Data",
                                    placement: "center",
                                    isLoading: createDataProducer.isLoading,
                                    onSubmit: (values) => {
                                        createDataProducer.mutate(values, {
                                            onSuccess: () => {
                                                toaster.create({
                                                    title: "Sukses",
                                                    description: "Produsen Data berhasil ditambahkan",
                                                    type: "success"
                                                })
                                                DataProducerForm.close("create") // close setelah sukses
                                            },
                                            onError: () => {
                                                const message = "Gagal menambahkan Produsen Data!"
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
                            <MdAdd /> Tambah Produsen Data
                        </Button>
                    </Box>
                </Flex>

                <DataProducerTable />

                <DataProducerForm.Viewport />

            </>

        </AuthenticatedLayout>
    )
}
