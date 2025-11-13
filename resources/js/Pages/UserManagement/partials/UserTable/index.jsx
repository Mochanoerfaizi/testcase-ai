"use client"

import React, {useState} from "react"
import DataTable from "@/Components/DataTable"
import { usePersistedParams } from "@/hooks/Utils/usePersistedParams.js"
import { useUsers, useUpdateUser, useDeleteUser, useToggleUserActive } from "@/Hooks/Services/useUsers.js"
import { UserColumns } from "@/Pages/UserManagement/partials/UserTable/UserColumns.jsx"
import { toaster } from "@/Components/themes/ui/toaster"
import UserForm from "@/Pages/UserManagement/partials/UserForm/index.jsx";
import {ConfirmDialog} from "@/Components/ConfirmDialog.jsx";

export default function UserTable() {

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const [params, setParams] = usePersistedParams({
        page: 1,
        per_page: 5,
        sort_by: "",
        sort_order: "",
        filter_column: null,
        filter_value: "",
    })

    const { data, isLoading } = useUsers(params)
    const updateUser = useUpdateUser()
    const deleteUser = useDeleteUser()
    const toggleUserActive = useToggleUserActive()

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
    const handleEdit = (user) => {
        UserForm.open("edit", {
            title: "Edit User",
            placement: "center",
            initialData: user,
            isLoading: updateUser.isLoading,
            onSubmit: (values) => {
                updateUser.mutate(
                    { id: user.id, ...values },
                    {
                        onSuccess: () => {
                            toaster.create({
                                title: "Success",
                                description: "User berhasil diperbarui",
                                type: "success"
                            })
                            UserForm.close("edit")
                        },
                        onError: (err) => {
                            const message = err?.response?.data?.message || "Gagal memperbarui User!"
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

    const handleToggleActive = (user) => {
        toggleUserActive.mutate(user.id, {
            onSuccess: () => {
                toaster.create({
                    title: "Success",
                    description: `User berhasil ${user.is_active ? 'dinonaktifkan' : 'diaktifkan'}`,
                    type: "success"
                })
            },
            onError: (err) => {
                const message = err?.response?.data?.message || "Gagal mengubah status user"
                toaster.create({
                    title: "Error",
                    description: message,
                    status: "error",
                    type: "error"
                })
            },
        })
    }

    const handleDelete = (user) => {
        setSelectedUser(user)
        setConfirmOpen(true)
    }

    const confirmDelete = () => {
        if (!selectedUser) return
        deleteUser.mutate(selectedUser.id, {
            onSuccess: () => {
                toaster.create({
                    title: "Success",
                    description: "User berhasil dihapus",
                    status: "success",
                    type: "success"
                })
                setConfirmOpen(false)
                setSelectedUser(null)
            },
            onError: (err) => {
                toaster.create({
                    title: "Error",
                    description: err?.response?.data?.message || "Gagal menghapus User",
                    status: "error",
                    type: "error",
                })
            },
        })
    }

    const columns = UserColumns({
        onEdit: handleEdit,
        onToggleActive: handleToggleActive,
        onDelete: handleDelete,
    })

    return (
        <>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={({ open }) => setConfirmOpen(open)}
                title="Konfirmasi Hapus"
                message={
                    selectedUser ? (
                        <>
                            Yakin mau hapus User <strong>{selectedUser.name}</strong>?
                        </>
                    ) : (
                        "Yakin mau hapus User ini?"
                    )
                }
                confirmText="Delete"
                cancelText="Batal"
                colorScheme="red"
                onConfirm={confirmDelete}
                isLoading={deleteUser.isLoading}
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
            <UserForm.Viewport />
        </>
    )
}
