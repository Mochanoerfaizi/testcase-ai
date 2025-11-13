import { Text } from "@chakra-ui/react"
import {DataProducerActionRow} from "@/Pages/Master/DataProducer/partials/DataProducerTable/DataProducerActionRow.jsx";

export const DataProducerColumns = (actions) => [
    {
        accessorKey: "name",
        header: "Nama Produsen",
        size: 500,
        cell: ({ row }) => (
            <Text>
                {row.original.name}
            </Text>
        ),
    },
    {
        accessorKey: "classification",
        header: "Klasifikasi",
        size: 100,
        cell: ({ row }) => (
            <Text>
                {row.original.classification}
            </Text>
        ),
    },
    {
        accessorKey: "action",
        header: "Aksi",
        size: 10,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => <DataProducerActionRow row={row} {...actions} />,
    },
]
