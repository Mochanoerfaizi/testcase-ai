import React from "react";
import { IconButton, Menu } from "@chakra-ui/react";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function RoleActionRow({ role, onEdit, onDelete }) {
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
                    onClick={() => onEdit?.(role)}
                >
                    Edit
                </Menu.Item>
                <Menu.Item
                    value="delete"
                    color="red.500"
                    onClick={() => onDelete?.(role)}
                >
                    Delete
                </Menu.Item>
            </Menu.Content>
        </Menu.Root>
    );
}
