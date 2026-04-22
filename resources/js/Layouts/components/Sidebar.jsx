"use client"

import React, {useState} from "react"
import {Box, HStack, Show, VStack, Text, Menu, Portal} from "@chakra-ui/react"
import {Avatar} from "@/Components/themes/ui/avatar"
import MenuItem from "./MenuItem"
import ApplicationLogo from "@/Components/ApplicationLogo.jsx";
import {LogoMainApps} from "../../../assets/images/index.jsx";
import {menuItems} from "@/Constants/menu.js";
import { LuSettings, LuCircleHelp, LuSearch } from "react-icons/lu"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { router, usePage } from "@inertiajs/react"

export default function Sidebar({ isOpen }) {
    const [currentPage, setCurrentPage] = useState("dashboard")
    const [expandedItems, setExpandedItems] = useState({})
    const user = usePage().props.auth.user

    const handleToggleExpand = (id) => {
        setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const handleItemClick = (item) => {
        setCurrentPage(item.id)
        if (item.path) {
            window.location.href = route(item.path)
        }
    }

    const handleLogout = () => {
        router.post(route("logout"))
    }

    return (
        <Box
            as="aside"
            w={isOpen ? "260px" : "80px"}
            bg="white"
            color="gray.600"
            h="100vh"
            transition="width 0.2s"
            borderRightWidth="1px"
            borderColor="gray.200"
            display="flex"
            flexDirection="column"
        >
            {/* Logo / Title */}
            <Box p="4" mb="4">
                <HStack justify="flex-start" ps="2">
                    <Show when={isOpen}>
                        <ApplicationLogo
                            style={{ width: "13.3rem", color: "var(--chakra-colors-gray-500)" }}
                        />
                    </Show>
                    <Show when={!isOpen}>
                        <Box
                            w="8"
                            h="8"
                            bg="gray.800"
                            rounded="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text color="white" fontSize="sm" fontWeight="bold">A</Text>
                        </Box>
                    </Show>
                </HStack>
            </Box>

            {/* Menu */}
            <Box flex="1" overflowY="auto" px="2">
                <VStack align="stretch" gap="1">
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            isCollapsed={!isOpen}
                            expandedItems={expandedItems}
                            onToggleExpand={handleToggleExpand}
                            onItemClick={handleItemClick}
                        />
                    ))}
                </VStack>
            </Box>

            {/* Bottom Section */}
            <Box p="2" borderTopWidth="1px" borderColor="gray.200">
                <VStack align="stretch" gap="1">
                    {/* Settings */}
                    {/* <HStack
                        px="3"
                        py="2"
                        rounded="md"
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                        onClick={() => window.location.href = route("profile.edit")}
                    >
                        <LuSettings size={18} />
                        <Show when={isOpen}>
                            <Text fontSize="sm">Settings</Text>
                        </Show>
                    </HStack> */}

                    {/* Get Help */}
                    {/* <HStack
                        px="3"
                        py="2"
                        rounded="md"
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                    >
                        <LuCircleHelp size={18} />
                        <Show when={isOpen}>
                            <Text fontSize="sm">Get Help</Text>
                        </Show>
                    </HStack> */}

                    {/* Search */}
                    {/* <HStack
                        px="3"
                        py="2"
                        rounded="md"
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                    >
                        <LuSearch size={18} />
                        <Show when={isOpen}>
                            <Text fontSize="sm">Search</Text>
                        </Show>
                    </HStack> */}

                    {/* <Box borderTopWidth="1px" borderColor="gray.200" my="2" /> */}

                    {/* User Profile */}
                    <Menu.Root positioning={{ placement: "top-end" }}>
                        <Menu.Trigger asChild>
                            <HStack
                                px="2"
                                py="2"
                                rounded="md"
                                cursor="pointer"
                                _hover={{ bg: "gray.100" }}
                                justify="space-between"
                            >
                                <HStack gap="2">
                                    <Avatar
                                        size="sm"
                                        name={user?.name || "User"}
                                    />
                                    <Show when={isOpen}>
                                        <Box flex="1">
                                            <Text fontSize="sm" fontWeight="medium" lineHeight="tight">
                                                {user?.name}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500" lineHeight="tight">
                                                {user?.email}
                                            </Text>
                                        </Box>
                                    </Show>
                                </HStack>
                                <Show when={isOpen}>
                                    <HiOutlineDotsVertical size={16} />
                                </Show>
                            </HStack>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content minW="200px">
                                    {/* <Menu.Item
                                        value="account"
                                        onClick={() => window.location.href = route("profile.edit")}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                    >
                                        Account
                                    </Menu.Item> */}
                                    {/* <Menu.Item
                                        value="billing"
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                    >
                                        Billing
                                    </Menu.Item> */}
                                    {/* <Menu.Item
                                        value="notifications"
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                    >
                                        Notifications
                                    </Menu.Item> */}
                                    <Menu.Separator />
                                    <Menu.Item
                                        value="logout"
                                        color="red.500"
                                        onClick={handleLogout}
                                        cursor="pointer"
                                        _hover={{ bg: "gray.100" }}
                                    >
                                        Log out
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                </VStack>
            </Box>
        </Box>
    )
}
