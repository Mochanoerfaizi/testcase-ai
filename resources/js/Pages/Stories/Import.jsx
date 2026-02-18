import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Box, Button, Table, Text, VStack, Heading, Spinner, Field, NativeSelect, HStack, Dialog, Input, Textarea, Portal } from "@chakra-ui/react";
import { toaster } from "@/Components/themes/ui/toaster";
import { Checkbox } from "@/Components/themes/ui/checkbox";
import { PaginationRoot, PaginationPrevTrigger, PaginationNextTrigger, PaginationItems, PaginationPageText } from "@/Components/themes/ui/pagination";
import { useState, useEffect } from "react";
import axios from "axios";
import BaseSelect from "@/Components/BaseSelect";
import { router } from "@inertiajs/react";

export default function StoriesImport({ products }) {
    const [selectedProject, setSelectedProject] = useState("");
    const [fetchedStories, setFetchedStories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [milestones, setMilestones] = useState([]);
    const [selectedMilestone, setSelectedMilestone] = useState("");

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStories, setEditingStories] = useState([]);

    useEffect(() => {
        if (selectedProject) {
            setMilestones([]);
            axios.post(route('stories.fetch-milestones'), { project_id: selectedProject })
                .then(res => {
                    setMilestones(res.data.data);
                })
                .catch(err => {
                    console.error("Failed to fetch milestones", err);
                    toaster.create({ title: "Failed to fetch milestones", type: "error" });
                });
        } else {
            setMilestones([]);
        }
        setSelectedMilestone("");
    }, [selectedProject]);

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
            const payload = {
                project_id: selectedProject,
                page: pageToFetch,
                page_size: pageSize
            };
            if (selectedMilestone) {
                payload.milestone_id = selectedMilestone;
            }

            const response = await axios.post(route('stories.fetch-from-taiga'), payload);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const storiesToFetch = data.stories.map(s => ({
                ...s,
                ref: s.ref // Ensure ref is passed if available, otherwise backend might fail or we rely on ID if logice changes
            }));

            // We need to fetch details for selected stories to get full description
            const response = await axios.post(route('stories.fetch-details'), {
                project_id: selectedProject,
                stories: storiesToFetch
            });

            if (response.data.success) {
                setEditingStories(JSON.parse(JSON.stringify(response.data.data)));
                setIsEditModalOpen(true);
            } else {
                toaster.create({ title: "Failed to fetch story details", type: "error" });
                // Fallback to existing data if fetch fails? Or just show error?
                // Let's fallback to existing data but warn
                setEditingStories(JSON.parse(JSON.stringify(data.stories)));
                setIsEditModalOpen(true);
            }
        } catch (error) {
            console.error("Error fetching details", error);
            toaster.create({ title: "Failed to fetch story details", description: "Using cached data instead.", type: "warning" });
            setEditingStories(JSON.parse(JSON.stringify(data.stories)));
            setIsEditModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        setData("stories", editingStories);
        // We need to use specific post because setData updates are async/batched. 
        // Better to use the transformed data directly or rely on Inertia's data if updated properly.
        // Actually inertia setData updates 'data' ref. But to be safe and immediate:
        const payload = { ...data, stories: editingStories };

        router.post(route('stories.store'), payload, {
            onSuccess: () => {
                toaster.create({ title: "Stories imported successfully", type: "success" });
                setIsEditModalOpen(false);
            },
            onError: () => {
                toaster.create({ title: "Failed to import stories", type: "error" });
            }
        });
    };

    const updateEditingStory = (id, field, value) => {
        setEditingStories(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    // Auto-fetch stories when project or milestone changes
    useEffect(() => {
        if (selectedProject) {
            handleFetch(1);
        } else {
            setFetchedStories([]);
            setTotal(0);
        }
    }, [selectedProject, selectedMilestone]);

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

                        {milestones.length > 0 && (
                            <Field.Root>
                                <Field.Label>Select Milestone (Optional)</Field.Label>
                                <BaseSelect
                                    options={milestones.map(m => ({
                                        value: m.id,
                                        label: `${m.name} ${m.closed ? '(Closed)' : ''}`
                                    }))}
                                    value={selectedMilestone}
                                    onChange={(val) => setSelectedMilestone(val)}
                                    placeholder="Select Milestone"
                                    isClearable={true}
                                    styles={{
                                        container: (base) => ({ ...base, width: "100%" }),
                                    }}
                                />
                            </Field.Root>
                        )}

                        {selectedProject && (
                            <Text fontSize="sm" color="gray.600">
                                Linked Taiga Project ID: <b>{selectedProject}</b>
                            </Text>
                        )}
                    </VStack>

                    {isLoading && (
                        <Box display="flex" justifyContent="center" alignItems="center" py={10}>
                            <Spinner size="xl" color="blue.500" />
                            <Text ml={3}>Loading stories...</Text>
                        </Box>
                    )}

                    {!isLoading && fetchedStories.length > 0 && (
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
                                    Review & Save Selected Stories ({data.stories.length})
                                </Button>
                            </form>
                        </Box>
                    )}

                    <Dialog.Root open={isEditModalOpen} onOpenChange={(e) => setIsEditModalOpen(e.open)} size="xl">
                        <Portal>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                                <Dialog.Content>
                                    <Dialog.Header>
                                        <Dialog.Title>Review & Edit Stories</Dialog.Title>
                                    </Dialog.Header>
                                    <Dialog.Body>
                                        <Box overflowX="auto" maxH="60vh" overflowY="auto">
                                            <Table.Root size="sm">
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.ColumnHeader>ID</Table.ColumnHeader>
                                                        <Table.ColumnHeader>Subject</Table.ColumnHeader>
                                                        <Table.ColumnHeader>Description</Table.ColumnHeader>
                                                        <Table.ColumnHeader>Creator</Table.ColumnHeader>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {editingStories.map((story) => (
                                                        <Table.Row key={story.id}>
                                                            <Table.Cell>{story.taiga_id}</Table.Cell>
                                                            <Table.Cell>
                                                                <Input
                                                                    size="sm"
                                                                    value={story.subject}
                                                                    onChange={(e) => updateEditingStory(story.id, 'subject', e.target.value)}
                                                                />
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <Textarea
                                                                    size="sm"
                                                                    value={story.description || ''}
                                                                    onChange={(e) => updateEditingStory(story.id, 'description', e.target.value)}
                                                                    rows={2}
                                                                />
                                                            </Table.Cell>
                                                            <Table.Cell>{story.owner_extra_info?.full_name_display || story.creator_name}</Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                </Table.Body>
                                            </Table.Root>
                                        </Box>
                                    </Dialog.Body>
                                    <Dialog.Footer>
                                        <Dialog.ActionTrigger asChild>
                                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                        </Dialog.ActionTrigger>
                                        <Button colorPalette="blue" onClick={handleSave} isLoading={processing}>
                                            Save Stories
                                        </Button>
                                    </Dialog.Footer>
                                    <Dialog.CloseTrigger />
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </Portal>
                    </Dialog.Root>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
