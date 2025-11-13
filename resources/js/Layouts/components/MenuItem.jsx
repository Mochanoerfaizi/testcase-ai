"use client"

import React from "react"
import { Box, Flex, Text, Icon, Collapsible } from "@chakra-ui/react"
import { LuChevronDown, LuChevronUp } from "react-icons/lu"

export default function MenuItem({
                                     item,
                                     isCollapsed,
                                     expandedItems,
                                     onToggleExpand,
                                     onItemClick,
                                 }) {
    const IconComponent = item.icon || null
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.id]

    const getItemStyles = () => {
        const baseStyles = {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: "3",
            py: "3",
            fontSize: "sm",
            fontWeight: "medium",
            rounded: "lg",
            transition: "all 0.2s",
            cursor: "pointer",
            position: "relative",
            _hover: { bg: "gray.100", color: "gray.900" },
        }

        switch (item.level) {
            case 1:
                return { ...baseStyles, color: "gray.700", mx: "2", mb: "1" }
            case 2:
                return { ...baseStyles, color: "gray.600", ml: "6", mr: "2", mb: "1" }
            case 3:
                return { ...baseStyles, color: "gray.500", ml: "10", mr: "2", mb: "1" }
            case 4:
                return { ...baseStyles, color: "gray.400", ml: "14", mr: "2", mb: "1" }
            default:
                return baseStyles
        }
    }

    const getActiveIndicator = () => {
        if (item.level === 1) {
            return (
                <Box
                    position="absolute"
                    left="0"
                    top="0"
                    bottom="0"
                    w="1"
                    bg="blue.500"
                    roundedRight="full"
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    transition="opacity 0.2s"
                />
            )
        }
        return null
    }

    // jika punya children → gunakan Collapsible
    if (hasChildren) {
        return (
            <Collapsible.Root
                open={isExpanded}
                onOpenChange={() => onToggleExpand(item.id)}
            >
                <Collapsible.Trigger asChild>
                    <Flex role="group" {...getItemStyles()}>
                        {getActiveIndicator()}

                        <Flex align="center" minW="0" flex="1">
                            {IconComponent && (
                                <Icon
                                    as={IconComponent}
                                    boxSize={item.level === 1 ? "16px" : "12px"}
                                    mr={isCollapsed ? 0 : 3}
                                    mx={isCollapsed ? "auto" : undefined}
                                    flexShrink={0}
                                />
                            )}
                            {!isCollapsed && (
                                <Text isTruncated fontWeight="medium">
                                    {item.label}
                                </Text>
                            )}
                        </Flex>

                        {!isCollapsed && (
                            <Icon
                                as={isExpanded ? LuChevronUp : LuChevronDown}
                                boxSize="16px"
                                flexShrink={0}
                                transition="transform 0.2s"
                            />
                        )}
                    </Flex>
                </Collapsible.Trigger>

                {!isCollapsed && (
                    <Collapsible.Content>
                        <Box>
                            {item.children?.map((child) => (
                                <MenuItem
                                    key={child.id}
                                    item={child}
                                    isCollapsed={isCollapsed}
                                    expandedItems={expandedItems}
                                    onToggleExpand={onToggleExpand}
                                    onItemClick={onItemClick}
                                />
                            ))}
                        </Box>
                    </Collapsible.Content>
                )}
            </Collapsible.Root>
        )
    }

    // jika tidak punya children → item biasa
    return (
        <Flex
            role="group"
            {...getItemStyles()}
            onClick={() => onItemClick(item)}
        >
            {getActiveIndicator()}

            <Flex align="center" minW="0" flex="1">
                {IconComponent && (
                    <Icon
                        as={IconComponent}
                        boxSize={item.level === 1 ? "16px" : "12px"}
                        mr={isCollapsed ? 0 : 3}
                        mx={isCollapsed ? "auto" : undefined}
                        flexShrink={0}
                    />
                )}
                {!isCollapsed && (
                    <Text isTruncated fontWeight="medium">
                        {item.label}
                    </Text>
                )}
            </Flex>
        </Flex>
    )
}
