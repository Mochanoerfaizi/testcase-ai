import React from "react";
import { Box } from "@chakra-ui/react";
import DataTable from "@/Components/DataTable";
import { roleColumns } from "./RoleColumns";
import RoleActionRow from "./RoleActionRow";
import { useRoles, useDeleteRole } from "@/Hooks/Services/useRoles";
import { toaster } from "@/Components/themes/ui/toaster";

export default function RoleTable({ onEdit }) {
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

    const { data, isLoading, error } = useRoles(params);
    const deleteRole = useDeleteRole({
        onSuccess: () => {
            toaster.create({
                title: "Role deleted successfully",
                type: "success",
            });
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to delete role",
                description: error?.response?.data?.message || "An error occurred",
                type: "error",
            });
        },
    });

    const handleDelete = (role) => {
        if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
            deleteRole.mutate(role.id);
        }
    };

    const columnsWithActions = [
        ...roleColumns,
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <RoleActionRow
                    role={row.original}
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
