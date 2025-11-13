"use client"

import { Link } from "@inertiajs/react"
import { Box, Flex } from "@chakra-ui/react"

import ApplicationLogo from "@/Components/ApplicationLogo"
import {Heading} from "@/Components/themes/ui/index.jsx";

export default function GuestLayout({ children }) {
    return (
        <Flex
            minH="100vh"
            direction="column"
            align="center"
            bg="gray.100"
            pt={{ base: 6, sm: 0 }}
            justify={{ base: "flex-start", sm: "center" }}
        >
            {/* Logo */}
            <Flex
                direction="column"
                align="center"
                justify="center"
                mb={2}
                px={4}
            >
                <Link href="/">
                    <ApplicationLogo
                        style={{ width: "25rem", color: "var(--chakra-colors-gray-500)" }}
                    />
                </Link>
                <Heading
                    size="lg"
                    mt={2}
                    textAlign="center"
                    color="gray.700"
                >
                testcase
                </Heading>
            </Flex>

            {/* Card */}
            <Box
                mt={6}
                w="full"
                maxW="md"
                overflow="hidden"
                bg="white"
                px={6}
                py={4}
                shadow="md"
                rounded={{ sm: "lg" }}
            >
                {children}
            </Box>
        </Flex>
    )
}
