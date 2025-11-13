"use client"

import { Link } from "@inertiajs/react"
import { chakra } from "@chakra-ui/react"

const ChakraLink = chakra(Link)

export default function NavLink({ active = false, children, ...props }) {
    return (
        <ChakraLink
            px={1}
            pt={1}
            fontSize="sm"
            fontWeight="medium"
            lineHeight="5"
            transition="all 0.15s ease-in-out"
            borderColor={active ? "blue.400" : "transparent"}
            color={active ? "fg" : "fg.muted"}
            _hover={{
                borderColor: active ? "blue.700" : "gray.300",
                color: "fg",
            }}
            _focus={{
                outline: "none",
                borderColor: active ? "blue.700" : "gray.300",
                color: "fg",
            }}
            {...props}
        >
            {children}
        </ChakraLink>
    )
}
