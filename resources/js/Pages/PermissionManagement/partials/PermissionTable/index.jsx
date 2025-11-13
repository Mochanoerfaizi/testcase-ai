import React from "react";
import { Box } from "@chakra-ui/react";
import DataTable from "@/Components/DataTable";
import { permissionColumns } from "./PermissionColumns";
import PermissionActionRow from "./PermissionActionRow";
import { usePermissions, useDeletePermission } from "@/Hooks/Services/usePermissions";
import { toaster } from "@/Components/themes/ui/toaster";

export default function PermissionTable({ onEdit }) {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [globalFilter, setGlobalFilter] = React.useState("");
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [sorting, setSorting] = React.useState([]);

    const params = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        filter_value: globalFilter,
        filter_column: columnFilters?.[0]?.id || "",
        sort_by: sorting?.[0]?.id || "created_at",
        sort_order: sorting?.[0]?.desc ? "desc" : "asc",
    };

    const { data, isLoading, error } = usePermissions(params);
    const deletePermission = useDeletePermission({
        onSuccess: () => {
            toaster.create({
                title: "Permission deleted successfully",
                type: "success",
            });
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to delete permission",
                description: error?.response?.data?.message || "An error occurred",
                type: "error",
            });
        },
    });

    const handleDelete = (permission) => {
        if (window.confirm(`Are you sure you want to delete permission "${permission.name}"?`)) {
            deletePermission.mutate(permission.id);
        }
    };

    const columnsWithActions = [
        ...permissionColumns,
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <PermissionActionRow
                    permission={row.original}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                />
            ),
            enableSorting: false,
            enableColumnFilter: false,
        },
    ];

    const handlePageChange = (newPageIndex) => {
        setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
    };

    const handlePageSizeChange = (newPageSize) => {
        setPagination({ pageIndex: 0, pageSize: newPageSize });
    };

    return (
        <>
            <DataTable
                columns={columnsWithActions}
                data={data?.rows || []}
                totalPages={data?.totalPages || 0}
                pageIndex={pagination.pageIndex}
                setPageIndex={handlePageChange}
                pageSize={pagination.pageSize}
                setPageSize={handlePageSizeChange}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                sorting={sorting}
                setSorting={setSorting}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
}
