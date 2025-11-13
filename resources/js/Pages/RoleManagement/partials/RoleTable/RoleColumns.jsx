import { Badge, Box, Flex } from "@chakra-ui/react";

export const roleColumns = [
    {
        accessorKey: "name",
        header: "Role Name",
        cell: ({ row }) => (
            <Box fontWeight="medium">
                {row.original.name}
            </Box>
        ),
        enableSorting: true,
        enableColumnFilter: true,
    },
    {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => {
            const permissions = row.original.permissions || [];
            return (
                <Flex gap={1} flexWrap="wrap">
                    {permissions.length > 0 ? (
                        <>
                            <Badge colorScheme="blue" variant="subtle">
                                {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                            </Badge>
                            {permissions.length <= 3 && permissions.map((perm, idx) => (
                                <Badge key={idx} colorScheme="gray" variant="outline" fontSize="xs">
                                    {perm.name}
                                </Badge>
                            ))}
                        </>
                    ) : (
                        <Badge colorScheme="gray" variant="subtle">
                            No permissions
                        </Badge>
                    )}
                </Flex>
            );
        },
        enableSorting: false,
        enableColumnFilter: false,
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
