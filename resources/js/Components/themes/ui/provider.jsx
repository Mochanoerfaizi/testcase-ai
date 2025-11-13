"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

import { ColorModeProvider } from "./color-mode"

import { system } from "@/Components/themes"

export function Provider(props) {
    return (
        <ChakraProvider value={system}>
            <ColorModeProvider forcedTheme="light" {...props} />
        </ChakraProvider>
    )
}
