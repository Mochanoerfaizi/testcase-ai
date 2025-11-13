"use client"

import { IconButton, Menu } from "@chakra-ui/react"
import { HiOutlineDotsVertical } from "react-icons/hi"
import {Button} from "@/Components/themes/ui/index.jsx";

export function DataProducerActionRow({ row, onDetail, onEdit, onDelete }) {
    const dataProducer = row.original

    return (
        <Menu.Root positioning={{ placement: "left-start" }}>
            <Menu.Trigger asChild>
                <Button
                    size="xs"
                    w="5"
                    rounded="full"
                    bg="gray.300"
                >
                    <HiOutlineDotsVertical color="black" />
                </Button>
            </Menu.Trigger>
            <Menu.Positioner>
                <Menu.Content minW="150px">
                    <Menu.Item _hover={{ bg: "gray.100", color: "gray.600" }} cursor="pointer" onClick={() => onEdit?.(dataProducer)}>Edit</Menu.Item>
                    <Menu.Item _hover={{ bg: "gray.100", color: "gray.600" }} cursor="pointer" color="red.500" onClick={() => onDelete?.(dataProducer)}>
                        Delete
                    </Menu.Item>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    )
}
