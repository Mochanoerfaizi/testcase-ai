import { Text, Flex, Badge } from "@chakra-ui/react"
import {ProductActionRow} from "@/Pages/ProductManagement/partials/ProductTable/ProductActionRow.jsx";

export const ProductColumns = (actions) => [
    {
        accessorKey: "name",
        header: "Nama Product",
        size: 250,
        cell: ({ row }) => (
            <Text>
                {row.original.name}
            </Text>
        ),
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        size: 300,
        enableSorting: false,
        cell: ({ row }) => (
            <Text noOfLines={2}>
                {row.original.description || "-"}
            </Text>
        ),
    },
    {
        accessorKey: "url",
        header: "URL",
        size: 150,
        cell: ({ row }) => {
            const url = row.original.url;
            return url ? (
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#3182ce', textDecoration: 'underline' }}
                >
                    Link
                </a>
            ) : (
                <Text color="gray.500">-</Text>
            );
        },
    },
    {
        accessorKey: "taiga_project_name",
        header: "Taiga Project",
        size: 200,
        cell: ({ row }) => {
            const projectName = row.original.taiga_project_name;
            return projectName ? (
                <Badge colorPalette="blue" variant="subtle">
                    {projectName}
                </Badge>
            ) : (
                <Text color="gray.500">-</Text>
            );
        },
    },
    {
        accessorKey: "action",
        header: "Aksi",
        size: 10,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => <ProductActionRow row={row} {...actions} />,
    },
]
