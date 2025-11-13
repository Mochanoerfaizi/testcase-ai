import { Text, Badge, Flex } from "@chakra-ui/react"
import {UserActionRow} from "@/Pages/UserManagement/partials/UserTable/UserActionRow.jsx";

export const UserColumns = (actions) => [
    {
        accessorKey: "name",
        header: "Nama",
        size: 250,
        cell: ({ row }) => (
            <Text>
                {row.original.name}
            </Text>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        size: 250,
        cell: ({ row }) => (
            <Text>
                {row.original.email}
            </Text>
        ),
    },
    {
        accessorKey: "roles",
        header: "Roles",
        size: 200,
        cell: ({ row }) => {
            const roles = row.original.roles || [];
            return (
                <Flex gap={1} flexWrap="wrap">
                    {roles.length > 0 ? (
                        roles.map((role, idx) => (
                            <Badge
                                key={idx}
                                colorPalette="blue"
                                variant="subtle"
                                fontSize="xs"
                            >
                                {role.name}
                            </Badge>
                        ))
                    ) : (
                        <Text fontSize="sm" color="gray.500">
                            No roles
                        </Text>
                    )}
                </Flex>
            );
        },
    },
    {
        accessorKey: "is_active",
        header: "Status",
        size: 100,
        cell: ({ row }) => (
            <Badge
                colorPalette={row.original.is_active ? "green" : "red"}
                variant="solid"
            >
                {row.original.is_active ? "Aktif" : "Non-Aktif"}
            </Badge>
        ),
    },
    {
        accessorKey: "action",
        header: "Aksi",
        size: 10,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => <UserActionRow row={row} {...actions} />,
    },
]
