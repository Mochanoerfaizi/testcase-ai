import React from "react";
import { IconButton, Menu } from "@chakra-ui/react";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function PermissionActionRow({ permission, onEdit, onDelete }) {
    return (
        <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger asChild>
                <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Actions"
                >
                    <HiOutlineDotsVertical />
                </IconButton>
            </Menu.Trigger>
            <Menu.Content minW="150px">
                <Menu.Item
                    value="edit"
                    onClick={() => onEdit?.(permission)}
                >
                    Edit
                </Menu.Item>
                <Menu.Item
                    value="delete"
                    color="red.500"
                    onClick={() => onDelete?.(permission)}
                >
                    Delete
                </Menu.Item>
            </Menu.Content>
        </Menu.Root>
    );
}
