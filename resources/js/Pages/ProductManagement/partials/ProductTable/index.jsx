"use client"

import React, {useState} from "react"
import DataTable from "@/Components/DataTable"
import { usePersistedParams } from "@/hooks/Utils/usePersistedParams.js"
import { useProducts, useUpdateProduct, useDeleteProduct } from "@/Hooks/Services/useProducts.js"
import { ProductColumns } from "@/Pages/ProductManagement/partials/ProductTable/ProductColumns.jsx"
import { toaster } from "@/Components/themes/ui/toaster"
import ProductForm from "@/Pages/ProductManagement/partials/ProductForm/index.jsx";
import {ConfirmDialog} from "@/Components/ConfirmDialog.jsx";

export default function ProductTable() {

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const [params, setParams] = usePersistedParams({
        page: 1,
        per_page: 5,
        sort_by: "",
        sort_order: "",
        filter_column: null,
        filter_value: "",
    })

    const { data, isLoading } = useProducts(params)
    const updateProduct = useUpdateProduct()
    const deleteProduct = useDeleteProduct()

    // --- Handlers ---
    const getSorting = () =>
        params.sort_by ? [{ id: params.sort_by, desc: params.sort_order === "desc" }] : []

    const handleSortingChange = (sort) => {
        setParams((prev) => {
            const newSortBy = sort[0]?.id ?? "created_at"
            const newSortOrder = sort[0]?.desc ? "desc" : "asc"

            if (prev.sort_by === newSortBy && prev.sort_order === newSortOrder) {
                return prev
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
    const handleEdit = (product) => {
        ProductForm.open("edit", {
            title: "Edit Product",
            placement: "center",
            initialData: product,
            isLoading: updateProduct.isLoading,
            onSubmit: (values) => {
                updateProduct.mutate(
                    { id: product.id, ...values },
                    {
                        onSuccess: () => {
                            toaster.create({
                                title: "Success",
                                description: "Product berhasil diperbarui",
                                type: "success"
                            })
                            ProductForm.close("edit")
                        },
                        onError: (err) => {
                            const message = err?.response?.data?.message || "Gagal memperbarui Product!"
                            toaster.create({
                                title: "Error",
                                description: message,
                                status: "error",
                                type: "error"
                            })
                        },
                    }
                )
            },
        })
    }

    const handleDelete = (product) => {
        setSelectedProduct(product)
        setConfirmOpen(true)
    }

    const confirmDelete = () => {
        if (!selectedProduct) return
        deleteProduct.mutate(selectedProduct.id, {
            onSuccess: () => {
                toaster.create({
                    title: "Success",
                    description: "Product berhasil dihapus",
                    status: "success",
                    type: "success"
                })
                setConfirmOpen(false)
                setSelectedProduct(null)
            },
            onError: (err) => {
                toaster.create({
                    title: "Error",
                    description: err?.response?.data?.message || "Gagal menghapus Product",
                    status: "error",
                    type: "error",
                })
            },
        })
    }

    const columns = ProductColumns({
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
                    selectedProduct ? (
                        <>
                            Yakin mau hapus Product <strong>{selectedProduct.name}</strong>?
                        </>
                    ) : (
                        "Yakin mau hapus Product ini?"
                    )
                }
                confirmText="Delete"
                cancelText="Batal"
                colorScheme="red"
                onConfirm={confirmDelete}
                isLoading={deleteProduct.isLoading}
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
            <ProductForm.Viewport />
        </>
    )
}
