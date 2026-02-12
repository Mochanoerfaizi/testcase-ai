import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Box, Button, Flex, Table, Text } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";

export default function StoriesIndex({ stories }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Stories
                </h2>
            }
        >
            <Head title="Stories" />

            <Box maxW="7xl" mx="auto" py={6} px={{ base: 2, sm: 6, lg: 8 }}>
                <Flex justify="space-between" align="center" mb={6}>
                    <Text fontSize="2xl" fontWeight="bold">List Stories</Text>
                    <Button as={Link} href={route('stories.create')} colorPalette="blue">
                        <MdAdd /> Import Stories
                    </Button>
                </Flex>

                <Box bg="white" shadow="sm" rounded="lg" overflow="hidden">
                    <Box overflowX="auto">
                        <Table.Root variant="simple">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>ID (Taiga)</Table.ColumnHeader>
                                    <Table.ColumnHeader>Subject</Table.ColumnHeader>
                                    <Table.ColumnHeader>Product</Table.ColumnHeader>
                                    <Table.ColumnHeader>Creator</Table.ColumnHeader>
                                    <Table.ColumnHeader>Created Date</Table.ColumnHeader>
                                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {stories.length > 0 ? (
                                    stories.map((story) => (
                                        <Table.Row key={story.id}>
                                            <Table.Cell>{story.taiga_id}</Table.Cell>
                                            <Table.Cell>{story.subject}</Table.Cell>
                                            <Table.Cell>{story.product?.name}</Table.Cell>
                                            <Table.Cell>{story.creator_name}</Table.Cell>
                                            <Table.Cell>{new Date(story.taiga_created_at).toLocaleDateString()}</Table.Cell>
                                            <Table.Cell>
                                                <Flex gap={2}>
                                                    <Button as={Link} href={route('stories.edit', story.id)} size="sm" colorPalette="yellow">Edit</Button>
                                                    <Button
                                                        size="sm"
                                                        colorPalette="red"
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this story?')) {
                                                                router.delete(route('stories.destroy', story.id));
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Flex>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} textAlign="center">
                                            No stories found.
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
