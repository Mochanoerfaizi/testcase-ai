"use client"

import {
    Flex,
    HStack,
    Text,
    IconButton,
    Link,
} from "@chakra-ui/react"
import { LuMenu } from "react-icons/lu"

export default function Header({ header, toggleSidebar }) {
    return (
        <Flex
            h="14"
            px="4"
            align="center"
            justify="space-between"
            bg="white"
            borderBottomWidth="1px"
            borderColor="gray.200"
        >
            <HStack gap="3">
                <IconButton
                    aria-label="Toggle Sidebar"
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                >
                    <LuMenu size={20} />
                </IconButton>
                {header && (
                    <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                        {header}
                    </Text>
                )}
            </HStack>

            <HStack gap="4">
                {/* <Link
                    href="https://github.com/ferdhika31"
                    target="_blank"
                    fontSize="sm"
                    color="gray.600"
                    _hover={{ color: "gray.800", textDecoration: "none" }}
                >
                    GitHub
                </Link> */}
            </HStack>
        </Flex>
    )
}
