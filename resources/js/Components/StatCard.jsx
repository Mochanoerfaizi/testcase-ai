import { Box, Text, HStack, VStack } from "@chakra-ui/react"
import { LuTrendingUp, LuTrendingDown } from "react-icons/lu"

export default function StatCard({ title, value, change, trend, description, subtitle }) {
    const isPositive = trend === "up"
    const TrendIcon = isPositive ? LuTrendingUp : LuTrendingDown

    return (
        <Box
            bg="white"
            p="6"
            rounded="lg"
            shadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
        >
            <VStack align="stretch" gap="3">
                {/* Header */}
                <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        {title}
                    </Text>
                    {change && (
                        <HStack gap="1" color={isPositive ? "green.600" : "red.600"}>
                            <Box as={TrendIcon} fontSize="sm" />
                            <Text fontSize="sm" fontWeight="medium">
                                {change}
                            </Text>
                        </HStack>
                    )}
                </HStack>

                {/* Value */}
                <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                    {value}
                </Text>

                {/* Description */}
                {description && (
                    <HStack gap="1">
                        <Box as={TrendIcon} fontSize="sm" color={isPositive ? "green.600" : "red.600"} />
                        <Text fontSize="xs" color="gray.600">
                            {description}
                        </Text>
                    </HStack>
                )}

                {/* Subtitle */}
                {subtitle && (
                    <Text fontSize="xs" color="gray.500">
                        {subtitle}
                    </Text>
                )}
            </VStack>
        </Box>
    )
}
