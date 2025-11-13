import { Box, Badge } from "@chakra-ui/react";

export const permissionColumns = [
    {
        accessorKey: "name",
        header: "Permission Name",
        cell: ({ row }) => (
            <Box fontWeight="medium">
                {row.original.name}
            </Box>
        ),
        enableSorting: true,
        enableColumnFilter: true,
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return date.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },
        enableSorting: true,
        enableColumnFilter: false,
    },
];
