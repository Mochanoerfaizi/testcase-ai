"use client"

import React, {useState} from "react"
import DataTable from "@/Components/DataTable"
import { usePersistedParams } from "@/hooks/Utils/usePersistedParams.js"
import { useDataProducers, useUpdateDataProducer, useDeleteDataProducer } from "@/Hooks/Services/useDataProducers.js"
import { DataProducerColumns } from "@/Pages/Master/DataProducer/partials/DataProducerTable/DataProducerColumns.jsx"
import { toaster } from "@/Components/themes/ui/toaster"
import DataProducerForm from "@/Pages/Master/DataProducer/partials/DataProducerForm/index.jsx";
import {ConfirmDialog} from "@/Components/ConfirmDialog.jsx";

export default function DataProducerTable() {

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedDataProducer, setSelectedDataProducer] = useState(null)

    const [params, setParams] = usePersistedParams({
        page: 1,
        per_page: 5,
        sort_by: "",
        sort_order: "",
        filter_column: null,
        filter_value: "",
    })

    const { data, isLoading } = useDataProducers(params)
    const updateDataProducer = useUpdateDataProducer()
    const deleteDataProducer = useDeleteDataProducer()

    // --- Handlers ---
    const getSorting = () =>
        params.sort_by ? [{ id: params.sort_by, desc: params.sort_order === "desc" }] : []

    const handleSortingChange = (sort) => {
        setParams((prev) => {
            const newSortBy = sort[0]?.id ?? "code"
            const newSortOrder = sort[0]?.desc ? "desc" : "asc"

            if (prev.sort_by === newSortBy && prev.sort_order === newSortOrder) {
                return prev // ❌ jangan update kalau sama
            }

            return {
                ...prev,
                sort_by: newSortBy,
                sort_order: newSortOrder,
            }
        })
    }

    const handlePageChange = (p) => setParams((prev) => ({ ...prev, page: p + 1 }))
    const handlePageSizeChange = (s) => setParams((prev) => ({ ...prev, per_page: s, page: 1 }))
    const handleGlobalFilter = (val) => setParams((prev) => ({ ...prev, filter_value: val, page: 1 }))
    const getColumnFilters = () =>
        params.filter_column ? [{ id: params.filter_column, value: params.filter_value }] : []

    const handleColumnFilters = (filters) =>
        setParams((prev) => ({
            ...prev,
            filter_column: filters[0]?.id ?? null,
            filter_value: filters[0]?.value ?? "",
            page: 1,
        }))

    // --- Action handlers ---
    const handleEdit = (dataProducer) => {
        DataProducerForm.open("edit", {
            title: "Edit DataProducer",
            placement: "center",
            initialData: dataProducer,
            isLoading: updateDataProducer.isLoading,
            onSubmit: (values) => {
                updateDataProducer.mutate(
                    { id: dataProducer.id, ...values },
                    {
                        onSuccess: () => {
                            toaster.create({
                                title: "Success",
                                description: "Produsen Data berhasil diperbarui",
                                type: "success"
                            })
                            DataProducerForm.close("edit")
                        },
                        onError: (err) => {
                            toaster.create({
                                title: "Error",
                                description: "Gagal memperbarui Produsen Data!",
                                status: "error",
                                type: "error"
                            })
                        },
                    }
                )
            },
        })
    }

    const handleDelete = (dataProducer) => {
        setSelectedDataProducer(dataProducer)
        setConfirmOpen(true)
    }

    const confirmDelete = () => {
        if (!selectedDataProducer) return
        deleteDataProducer.mutate(selectedDataProducer.id, {
            onSuccess: () => {
                toaster.create({
                    title: "Success",
                    description: "Produsen Data berhasil dihapus",
                    status: "success",
                    type: "success"
                })
                setConfirmOpen(false)
                setSelectedDataProducer(null)
            },
            onError: (err) => {
                toaster.create({
                    title: "Error",
                    description: err?.response?.data?.message || "Gagal menghapus Produsen Data",
                    status: "error",
                    type: "error",
                })
            },
        })
    }

    const columns = DataProducerColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    })

    return (
        <>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={({ open }) => setConfirmOpen(open)}
                title="Konfirmasi Hapus"
                message={
                    selectedDataProducer ? (
                        <>
                            Yakin mau hapus Produsen Data <strong>{selectedDataProducer.name}</strong>?
                        </>
                    ) : (
                        "Yakin mau hapus Produsen Data ini?"
                    )
                }
                confirmText="Delete"
                cancelText="Batal"
                colorScheme="red"
                onConfirm={confirmDelete}
                isLoading={deleteDataProducer.isLoading}
            />

            <DataTable
                columns={columns}
                data={data?.rows ?? []}
                totalPages={data?.totalPages ?? 0}
                isLoading={isLoading}
                pageIndex={params.page - 1}
                setPageIndex={handlePageChange}
                pageSize={params.per_page}
                setPageSize={handlePageSizeChange}
                sorting={getSorting()}
                setSorting={handleSortingChange}
                globalFilter={params.filter_value}
                setGlobalFilter={handleGlobalFilter}
                columnFilters={getColumnFilters()}
                setColumnFilters={handleColumnFilters}
            />

            {/* viewport modal form */}
            <DataProducerForm.Viewport />
        </>
    )
}
