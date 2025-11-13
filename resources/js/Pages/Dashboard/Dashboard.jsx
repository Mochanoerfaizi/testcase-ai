import {Head} from "@inertiajs/react"
import {Box, Grid, Text, VStack, HStack, Button, SimpleGrid} from "@chakra-ui/react"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx"
import StatCard from "@/Components/StatCard.jsx"

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header="Dashboard"
        >
            <Head title="Dashboard"/>

            <VStack align="stretch" gap="6">
                {/* Metric Cards */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="4">
                    <StatCard
                        title="Total Revenue"
                        value="$1,250.00"
                        change="+12.5%"
                        trend="up"
                        description="Trending up this month"
                        subtitle="Visitors for the last 6 months"
                    />
                    <StatCard
                        title="New Customers"
                        value="1,234"
                        change="-20%"
                        trend="down"
                        description="Down 20% this period"
                        subtitle="Acquisition needs attention"
                    />
                    <StatCard
                        title="Active Accounts"
                        value="45,678"
                        change="+12.5%"
                        trend="up"
                        description="Strong user retention"
                        subtitle="Engagement exceed targets"
                    />
                    <StatCard
                        title="Growth Rate"
                        value="4.5%"
                        change="+4.5%"
                        trend="up"
                        description="Steady performance increase"
                        subtitle="Meets growth projections"
                    />
                </SimpleGrid>

                {/* Chart Section */}
                <Box
                    bg="white"
                    p="6"
                    rounded="lg"
                    shadow="sm"
                    borderWidth="1px"
                    borderColor="gray.200"
                >
                    <VStack align="stretch" gap="4">
                        {/* Chart Header */}
                        <HStack justify="space-between">
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                                    Total Visitors
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Total for the last 3 months
                                </Text>
                            </Box>
                            <HStack gap="2">
                                <Button size="sm" variant="ghost">
                                    Last 3 months
                                </Button>
                                <Button size="sm" variant="ghost">
                                    Last 30 days
                                </Button>
                                <Button size="sm" variant="ghost">
                                    Last 7 days
                                </Button>
                            </HStack>
                        </HStack>

                        {/* Chart Placeholder */}
                        <Box
                            h="300px"
                            bg="gray.50"
                            rounded="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text color="gray.500" fontSize="sm">
                                Chart visualization will be displayed here
                            </Text>
                        </Box>
                    </VStack>
                </Box>

                {/* Table Section */}
                <Box
                    bg="white"
                    p="6"
                    rounded="lg"
                    shadow="sm"
                    borderWidth="1px"
                    borderColor="gray.200"
                >
                    <VStack align="stretch" gap="4">
                        {/* Table Header */}
                        <HStack justify="space-between">
                            <HStack gap="4">
                                <Button size="sm" variant="outline">
                                    Key Personnel 2
                                </Button>
                                <Button size="sm" variant="ghost">
                                    Focus Documents
                                </Button>
                            </HStack>
                            <HStack gap="2">
                                <Button size="sm" variant="ghost">
                                    Customize Columns
                                </Button>
                                <Button size="sm" variant="ghost">
                                    + Add Section
                                </Button>
                            </HStack>
                        </HStack>

                        {/* Table Placeholder */}
                        <Box
                            h="200px"
                            bg="gray.50"
                            rounded="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text color="gray.500" fontSize="sm">
                                Table content will be displayed here
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </AuthenticatedLayout>
    )
}
