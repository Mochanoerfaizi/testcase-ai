"use client"

import {
    Box,
    Flex,
} from "@chakra-ui/react"
import { useState } from "react"
import { usePage } from "@inertiajs/react"
import Sidebar from "@/Layouts/components/Sidebar.jsx"
import Header from "@/Layouts/components/Header.jsx"
import { Toaster } from "@/Components/themes/ui/toaster"

export default function AuthenticatedLayout({ header, children }) {
    const [currentPage, setCurrentPage] = useState("dashboard")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const user = usePage().props.auth.user
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

    return (
        <Flex h="100vh" bg="gray.50">

            <Toaster />

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            {/* Main Content */}
            <Flex flex="1" direction="column" overflow="hidden">
                {/* Header */}
                <Header header={header} user={user} toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <Box flex="1" overflowY="auto" bg="gray.50">
                    <Box p="6" maxW="1400px" mx="auto">
                        {children}
                    </Box>
                </Box>
            </Flex>
        </Flex>
    )
}
