import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Box, Button, Flex, Table, Text, Input, Dialog, Portal, VStack, HStack, Textarea } from "@chakra-ui/react";
import { MdAdd, MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { toaster } from "@/Components/themes/ui/toaster";
import { useState, useEffect, useRef, useCallback } from "react";

export default function StoriesIndex({ stories, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(route('stories.index'), { search: searchTerm }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);
    const [additionalsList, setAdditionalsList] = useState([]);

    // Hover-based floating menu state
    const [hoverMenu, setHoverMenu] = useState(null); // { storyId, top, left }
    const menuRef = useRef(null);
    const hideTimer = useRef(null);

    const showMenu = useCallback((story, iconEl) => {
        clearTimeout(hideTimer.current);
        const rect = iconEl.getBoundingClientRect();
        setHoverMenu({
            story,
            top: rect.bottom + 6,
            right: window.innerWidth - rect.right - rect.width / 2,
        });
    }, []);

    const hideMenu = useCallback(() => {
        hideTimer.current = setTimeout(() => setHoverMenu(null), 120);
    }, []);

    const cancelHide = useCallback(() => {
        clearTimeout(hideTimer.current);
    }, []);

    const openAdditionalModal = (story) => {
        setCurrentStory(story);
        setAdditionalsList(story.additionals || []);
        setIsAdditionalModalOpen(true);
    };

    const addAdditionalRow = () => {
        setAdditionalsList([...additionalsList, { key: '', label: '', value: '', description: '' }]);
    };

    const removeAdditionalRow = (index) => {
        setAdditionalsList(additionalsList.filter((_, i) => i !== index));
    };

    const updateAdditionalRow = (index, field, value) => {
        const newList = [...additionalsList];
        newList[index][field] = value;
        setAdditionalsList(newList);
    };

    const saveAdditionals = () => {
        if (!currentStory) return;

        router.post(route('stories.save-additionals', currentStory.id), {
            additionals: additionalsList
        }, {
            onSuccess: () => {
                toaster.create({ title: "Additional information saved", type: "success" });
                setIsAdditionalModalOpen(false);
            },
            onError: () => {
                toaster.create({ title: "Failed to save information", type: "error" });
            }
        });
    };

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

                <Box mb={4}>
                    <Input
                        placeholder="Search by Subject or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        maxW="400px"
                    />
                </Box>

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
                                            <Table.Cell style={{ width: '48px', textAlign: 'center' }}>
                                                {/* Eye icon — hover to reveal floating action menu */}
                                                <Box
                                                    as="button"
                                                    onMouseEnter={(e) => showMenu(story, e.currentTarget)}
                                                    onMouseLeave={hideMenu}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '6px',
                                                        borderRadius: '50%',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#9ca3af',
                                                        transition: 'color 0.2s, background 0.2s',
                                                    }}
                                                    onFocus={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = '#f3f4f6'; }}
                                                    onBlur={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'none'; }}
                                                    _hover={{ color: '#6b7280', background: '#f3f4f6' }}
                                                    aria-label="Actions"
                                                >
                                                    <MdRemoveRedEye size={20} />
                                                </Box>
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

            {/* Floating action menu — rendered via fixed positioning, never affects table layout */}
            {hoverMenu && (
                <Box
                    ref={menuRef}
                    onMouseEnter={cancelHide}
                    onMouseLeave={hideMenu}
                    style={{
                        position: 'fixed',
                        top: `${hoverMenu.top}px`,
                        right: `${hoverMenu.right}px`,
                        zIndex: 9999,
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                        minWidth: '140px',
                        overflow: 'hidden',
                        animation: 'fadeSlideIn 0.12s ease',
                    }}
                >
                    <style>{`
                        @keyframes fadeSlideIn {
                            from { opacity: 0; transform: translateY(-4px); }
                            to   { opacity: 1; transform: translateY(0); }
                        }
                        .action-menu-item {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            width: 100%;
                            padding: 9px 16px;
                            font-size: 13px;
                            font-weight: 500;
                            color: #374151;
                            background: none;
                            border: none;
                            cursor: pointer;
                            text-decoration: none;
                            transition: background 0.15s, color 0.15s;
                        }
                        .action-menu-item:hover { background: #f9fafb; }
                        .action-menu-item.view   { color: #0d9488; }
                        .action-menu-item.extras { color: #7c3aed; }
                        .action-menu-item.edit   { color: #d97706; }
                        .action-menu-item.delete { color: #dc2626; }
                        .action-menu-item.view:hover   { background: #f0fdfa; }
                        .action-menu-item.extras:hover { background: #faf5ff; }
                        .action-menu-item.edit:hover   { background: #fffbeb; }
                        .action-menu-item.delete:hover { background: #fef2f2; }
                        .action-menu-divider {
                            height: 1px;
                            background: #f3f4f6;
                            margin: 2px 0;
                        }
                    `}</style>

                    <Link
                        href={route('stories.show', hoverMenu.story.id)}
                        className="action-menu-item view"
                    >
                        <MdRemoveRedEye size={15} /> View
                    </Link>
                    <div className="action-menu-divider" />
                    <button
                        className="action-menu-item extras"
                        onClick={() => { setHoverMenu(null); openAdditionalModal(hoverMenu.story); }}
                    >
                        <MdEdit size={15} /> Extras
                    </button>
                    <div className="action-menu-divider" />
                    <Link
                        href={route('stories.edit', hoverMenu.story.id)}
                        className="action-menu-item edit"
                    >
                        <MdEdit size={15} /> Edit
                    </Link>
                    <div className="action-menu-divider" />
                    <button
                        className="action-menu-item delete"
                        onClick={() => {
                            setHoverMenu(null);
                            if (confirm('Are you sure you want to delete this story?')) {
                                router.delete(route('stories.destroy', hoverMenu.story.id));
                            }
                        }}
                    >
                        <MdDelete size={15} /> Delete
                    </button>
                </Box>
            )}

            <Dialog.Root open={isAdditionalModalOpen} onOpenChange={(e) => setIsAdditionalModalOpen(e.open)} size="xl">
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Manage Additional Info: {currentStory?.taiga_id}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <VStack align="stretch" spacing={4}>
                                    <Box overflowX="auto">
                                        <Table.Root size="sm">
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.ColumnHeader>Key</Table.ColumnHeader>
                                                    <Table.ColumnHeader>Label</Table.ColumnHeader>
                                                    <Table.ColumnHeader>Value</Table.ColumnHeader>
                                                    <Table.ColumnHeader>Description</Table.ColumnHeader>
                                                    <Table.ColumnHeader></Table.ColumnHeader>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {additionalsList.map((item, index) => (
                                                    <Table.Row key={index}>
                                                        <Table.Cell p={1}>
                                                            <Input size="xs" placeholder="Key" value={item.key} onChange={(e) => updateAdditionalRow(index, 'key', e.target.value)} />
                                                        </Table.Cell>
                                                        <Table.Cell p={1}>
                                                            <Input size="xs" placeholder="Label" value={item.label} onChange={(e) => updateAdditionalRow(index, 'label', e.target.value)} />
                                                        </Table.Cell>
                                                        <Table.Cell p={1}>
                                                            <Input size="xs" placeholder="Value" value={item.value} onChange={(e) => updateAdditionalRow(index, 'value', e.target.value)} />
                                                        </Table.Cell>
                                                        <Table.Cell p={1}>
                                                            <Input size="xs" placeholder="Desc" value={item.description || ''} onChange={(e) => updateAdditionalRow(index, 'description', e.target.value)} />
                                                        </Table.Cell>
                                                        <Table.Cell p={1}>
                                                            <Button size="xs" colorPalette="red" variant="ghost" onClick={() => removeAdditionalRow(index)}>
                                                                <MdDelete />
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table.Root>
                                    </Box>
                                    <Button size="sm" variant="outline" onClick={addAdditionalRow} alignSelf="start">
                                        <MdAdd /> Add Row
                                    </Button>
                                </VStack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" onClick={() => setIsAdditionalModalOpen(false)}>Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button colorPalette="blue" onClick={saveAdditionals}>
                                    Save Changes
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger />
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </AuthenticatedLayout>
    );
}
