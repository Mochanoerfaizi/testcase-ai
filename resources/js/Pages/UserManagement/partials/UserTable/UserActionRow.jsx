"use client"

import { IconButton, Menu } from "@chakra-ui/react"
import { HiOutlineDotsVertical } from "react-icons/hi"
import {Button} from "@/Components/themes/ui/index.jsx";

export function UserActionRow({ row, onEdit, onToggleActive, onDelete }) {
    const user = row.original

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
                    <Menu.Item
                        _hover={{ bg: "gray.100", color: "gray.600" }}
                        cursor="pointer"
                        onClick={() => onEdit?.(user)}
                    >
                        Edit
                    </Menu.Item>
                    <Menu.Item
                        _hover={{ bg: "gray.100", color: user.is_active ? "orange.600" : "green.600" }}
                        cursor="pointer"
                        color={user.is_active ? "orange.500" : "green.500"}
                        onClick={() => onToggleActive?.(user)}
                    >
                        {user.is_active ? "Non-aktifkan" : "Aktifkan"}
                    </Menu.Item>
                    <Menu.Item
                        _hover={{ bg: "gray.100", color: "gray.600" }}
                        cursor="pointer"
                        color="red.500"
                        onClick={() => onDelete?.(user)}
                    >
                        Delete
                    </Menu.Item>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    )
}
