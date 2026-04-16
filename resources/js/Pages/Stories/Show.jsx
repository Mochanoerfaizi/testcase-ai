import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Box, Button, Flex, Text, Heading, VStack, HStack, Badge, Grid, GridItem, Card, Table } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";

export default function StoryShow({ story }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateTestcases = () => {
        setIsGenerating(true);
        router.post(route('testcases.generate', story.id), {}, {
            preserveScroll: true,
            onFinish: () => setIsGenerating(false),
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Story Details
                </h2>
            }
        >
            <Head title={`Story - ${story.taiga_id}`} />

            <Box maxW="7xl" mx="auto" py={6} px={{ base: 4, sm: 6, lg: 8 }}>
                <Box mb={6}>
                    <Button as={Link} href={route('stories.index')} variant="ghost" pl={0}>
                        <MdArrowBack /> Back to Stories
                    </Button>
                </Box>

                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                    {/* Main Content Area */}
                    <GridItem>
                        <Card.Root bg="white" shadow="md" borderRadius="xl" overflow="hidden">
                            <Card.Body>
                                <Flex justify="space-between" align="flex-start" mb={4}>
                                    <VStack align="start" spacing={1}>
                                        <HStack>
                                            <Badge colorPalette="blue" px={2} py={1} borderRadius="md">
                                                Taiga ID: {story.taiga_id}
                                            </Badge>
                                            {story.product && (
                                                <Badge colorPalette="green" px={2} py={1} borderRadius="md">
                                                    Product: {story.product.name}
                                                </Badge>
                                            )}
                                        </HStack>
                                        <Heading as="h1" size="lg" mt={2} color="gray.800">
                                            {story.subject}
                                        </Heading>
                                    </VStack>
                                    {(!story.testcases || story.testcases.length === 0) && (
                                        <Button 
                                            colorPalette="teal" 
                                            onClick={generateTestcases}
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? "Generating..." : "Generate Testcases"}
                                        </Button>
                                    )}
                                </Flex>
                                
                                <Box as="hr" borderColor="gray.200" my={4} />
                                
                                <Box>
                                    <Heading as="h3" size="sm" color="gray.500" mb={3} textTransform="uppercase" letterSpacing="wide">
                                        Description
                                    </Heading>
                                    {story.description ? (
                                        <Box 
                                            className="prose max-w-none text-gray-700"
                                            dangerouslySetInnerHTML={{ __html: story.description }}
                                            sx={{
                                                '& p': { mb: 4 },
                                                '& ul, & ol': { pl: 5, mb: 4 },
                                                '& h1, & h2, & h3, & h4': { mt: 6, mb: 4, fontWeight: 'bold' }
                                            }}
                                        />
                                    ) : (
                                        <Text fontStyle="italic" color="gray.400">No description provided.</Text>
                                    )}
                                </Box>

                                {/* Testcases Section */}
                                {story.testcases && story.testcases.length > 0 && (
                                    <Box mt={8}>
                                        <Heading as="h3" size="md" mb={4} color="gray.700" pb={2} borderBottomWidth="1px" borderColor="gray.200">
                                            Generated Testcases
                                        </Heading>
                                        <Box overflowX="auto">
                                            <Table.Root variant="simple" size="sm">
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                                                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                                                        <Table.ColumnHeader>Description</Table.ColumnHeader>
                                                        <Table.ColumnHeader>Script / Steps</Table.ColumnHeader>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {story.testcases.map((tc, idx) => (
                                                        <Table.Row key={tc.id || idx}>
                                                            <Table.Cell fontWeight="bold" color="blue.700" whiteSpace="normal" minW="200px">
                                                                {tc.name}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <Badge colorPalette="orange" variant="subtle">{tc.status}</Badge>
                                                            </Table.Cell>
                                                            <Table.Cell whiteSpace="normal" minW="250px">
                                                                {tc.description}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {tc.script ? (
                                                                    <Box as="pre" p={2} bg="gray.800" color="green.300" rounded="md" fontSize="xs" overflowX="auto" whiteSpace="pre-wrap" maxH="150px" maxW="400px" overflowY="auto">
                                                                        {tc.script}
                                                                    </Box>
                                                                ) : '-'}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                </Table.Body>
                                            </Table.Root>
                                        </Box>
                                    </Box>
                                )}
                            </Card.Body>
                        </Card.Root>
                    </GridItem>

                    {/* Sidebar / Metadata Area */}
                    <GridItem>
                        <VStack spacing={6} align="stretch">
                            <Card.Root bg="white" shadow="md" borderRadius="xl">
                                <Card.Body>
                                    <Heading as="h3" size="sm" color="gray.500" mb={4} textTransform="uppercase" letterSpacing="wide">
                                        Metadata
                                    </Heading>
                                    <VStack align="start" spacing={3}>
                                        <Box>
                                            <Text fontSize="sm" color="gray.500">Creator</Text>
                                            <Text fontWeight="medium">{story.creator_name}</Text>
                                        </Box>
                                        {story.assigned_to && (
                                            <Box>
                                                <Text fontSize="sm" color="gray.500">Assigned To</Text>
                                                <Text fontWeight="medium">{story.assigned_to.full_name_display || 'Unknown'}</Text>
                                            </Box>
                                        )}
                                        <Box>
                                            <Text fontSize="sm" color="gray.500">Created At (Taiga)</Text>
                                            <Text fontWeight="medium">
                                                {new Date(story.taiga_created_at).toLocaleString()}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="gray.500">Imported At</Text>
                                            <Text fontWeight="medium">
                                                {new Date(story.created_at).toLocaleString()}
                                            </Text>
                                        </Box>
                                    </VStack>
                                </Card.Body>
                            </Card.Root>

                            {/* Additional Info Section */}
                            <Card.Root bg="white" shadow="md" borderRadius="xl">
                                <Card.Body>
                                    <Flex justify="space-between" align="center" mb={4}>
                                        <Heading as="h3" size="sm" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                                            Additional Info
                                        </Heading>
                                        <Badge colorPalette="purple" borderRadius="full">
                                            {story.additionals?.length || 0} items
                                        </Badge>
                                    </Flex>
                                    
                                    {story.additionals && story.additionals.length > 0 ? (
                                        <VStack align="stretch" spacing={3}>
                                            {story.additionals.map((item, index) => (
                                                <Box key={index} borderBottomWidth={index !== story.additionals.length - 1 ? "1px" : "0"} borderColor="gray.100" pb={3}>
                                                    <HStack justify="space-between" mb={1}>
                                                        <Text fontWeight="bold" fontSize="sm" color="gray.700">{item.label}</Text>
                                                        <Badge variant="subtle" size="sm">{item.key}</Badge>
                                                    </HStack>
                                                    <Text fontWeight="medium" mb={1}>{item.value}</Text>
                                                    {item.description && (
                                                        <Text fontSize="xs" color="gray.500">{item.description}</Text>
                                                    )}
                                                </Box>
                                            ))}
                                        </VStack>
                                    ) : (
                                        <Text fontSize="sm" color="gray.400" fontStyle="italic">
                                            No additional information found.
                                        </Text>
                                    )}
                                </Card.Body>
                            </Card.Root>
                        </VStack>
                    </GridItem>
                </Grid>
            </Box>
        </AuthenticatedLayout>
    );
}
