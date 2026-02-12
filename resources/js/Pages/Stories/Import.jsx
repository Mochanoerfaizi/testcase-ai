import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Box, Button, Table, Text, VStack, Heading, Spinner, Field, NativeSelect, HStack } from "@chakra-ui/react";
import { toaster } from "@/Components/themes/ui/toaster";
import { Checkbox } from "@/Components/themes/ui/checkbox";
import { PaginationRoot, PaginationPrevTrigger, PaginationNextTrigger, PaginationItems, PaginationPageText } from "@/Components/themes/ui/pagination";
import { useState } from "react";
import axios from "axios";

export default function StoriesImport({ products }) {
    const [selectedProject, setSelectedProject] = useState("");
    const [fetchedStories, setFetchedStories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        product_id: "",
        stories: []
    });

    const handleFetch = async (pageToFetch = 1) => {
        if (!selectedProject) {
            toaster.create({ title: "Please select a Taiga project", type: "warning" });
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(route('stories.fetch-from-taiga'), {
                project_id: selectedProject,
                page: pageToFetch,
                page_size: pageSize
            });

            if (response.data.data) {
                setFetchedStories(response.data.data);
                if (response.data.meta) {
                    setTotal(response.data.meta.total);
                    setPage(response.data.meta.current_page);
                }
            } else {
                // Fallback for non-paginated response structure if any
                setFetchedStories(response.data);
            }

            toaster.create({ title: "Stories fetched successfully", type: "success" });
        } catch (error) {
            toaster.create({
                title: "Failed to fetch stories",
                description: error.response?.data?.message || error.message,
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectStory = (story, isChecked) => {
        if (isChecked) {
            setData("stories", [...data.stories, story]);
        } else {
            setData("stories", data.stories.filter(s => s.id !== story.id));
        }
    };

    const isSelected = (id) => data.stories.some(s => s.id === id);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('stories.store'), {
            onSuccess: () => {
                toaster.create({ title: "Stories imported successfully", type: "success" });
            },
            onError: () => {
                toaster.create({ title: "Failed to import stories", type: "error" });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <Heading size="md" className="text-xl font-semibold leading-tight text-gray-800">
                    Import Stories
                </Heading>
            }
        >
            <Head title="Import Stories" />

            <Box maxW="7xl" mx="auto" py={6} px={{ base: 2, sm: 6, lg: 8 }}>
                <Box bg="white" p={6} rounded="lg" shadow="sm">
                    <VStack spacing={4} align="stretch">
                        <Field.Root required invalid={!!errors.product_id}>
                            <Field.Label>Select Product (Destination)</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field
                                    placeholder="Select Product"
                                    value={data.product_id}
                                    onChange={(e) => {
                                        const prodId = e.target.value;
                                        setData("product_id", prodId);
                                        const prod = products.find(p => p.id == prodId);
                                        if (prod) {
                                            setSelectedProject(prod.taiga_project_id);
                                        } else {
                                            setSelectedProject("");
                                        }
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} {p.taiga_project_name ? `(${p.taiga_project_name})` : ''}</option>)}
                                </NativeSelect.Field>
                            </NativeSelect.Root>
                            {errors.product_id && <Field.ErrorText>{errors.product_id}</Field.ErrorText>}
                        </Field.Root>

                        {selectedProject && (
                            <Text fontSize="sm" color="gray.600">
                                Linked Taiga Project ID: <b>{selectedProject}</b>
                            </Text>
                        )}

                        <Button onClick={() => handleFetch(1)} isLoading={isLoading} loadingText="Fetching..." colorPalette="blue" disabled={!selectedProject}>
                            Fetch Stories
                        </Button>
                    </VStack>

                    {fetchedStories.length > 0 && (
                        <Box mt={8}>
                            <Heading size="sm" mb={4}>Fetched Stories ({fetchedStories.length})</Heading>
                            <form onSubmit={handleSubmit}>
                                <Box overflowX="auto">
                                    <Table.Root variant="simple" size="sm">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader width="40px">
                                                    <Checkbox
                                                        checked={
                                                            fetchedStories.length > 0 && fetchedStories.every(s => isSelected(s.id))
                                                                ? true
                                                                : fetchedStories.some(s => isSelected(s.id))
                                                                    ? "mixed"
                                                                    : false
                                                        }
                                                        onCheckedChange={(e) => {
                                                            if (e.checked === true) {
                                                                const storiesToAdd = fetchedStories.filter(s => !isSelected(s.id));
                                                                setData("stories", [...data.stories, ...storiesToAdd]);
                                                            } else {
                                                                const fetchedIds = fetchedStories.map(s => s.id);
                                                                setData("stories", data.stories.filter(s => !fetchedIds.includes(s.id)));
                                                            }
                                                        }}
                                                    />
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                                <Table.ColumnHeader>Subject</Table.ColumnHeader>
                                                <Table.ColumnHeader>Creator</Table.ColumnHeader>
                                                <Table.ColumnHeader>Date</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {fetchedStories.map(story => (
                                                <Table.Row key={story.id}>
                                                    <Table.Cell>
                                                        <Checkbox
                                                            checked={isSelected(story.id)}
                                                            onCheckedChange={(e) => handleSelectStory(story, !!e.checked)}
                                                        />
                                                    </Table.Cell>
                                                    <Table.Cell>{story.id}</Table.Cell>
                                                    <Table.Cell>{story.subject}</Table.Cell>
                                                    <Table.Cell>{story.owner_extra_info?.full_name_display}</Table.Cell>
                                                    <Table.Cell>{new Date(story.created_date).toLocaleDateString()}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>

                                {total > 0 && (
                                    <Box mt={4} display="flex" justifyContent="center">
                                        <PaginationRoot
                                            count={total}
                                            pageSize={pageSize}
                                            page={page}
                                            onPageChange={(e) => handleFetch(e.page)}
                                        >
                                            <HStack>
                                                <PaginationPrevTrigger />
                                                <PaginationItems />
                                                <PaginationNextTrigger />
                                            </HStack>
                                            <Box textAlign="center" mt={2}>
                                                <PaginationPageText format="long" />
                                            </Box>
                                        </PaginationRoot>
                                    </Box>
                                )}

                                <Button mt={4} type="submit" colorPalette="green" isLoading={processing} isDisabled={data.stories.length === 0}>
                                    Save Selected Stories ({data.stories.length})
                                </Button>
                            </form>
                        </Box>
                    )}
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
