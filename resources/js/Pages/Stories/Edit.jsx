import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Box, Button, Input, Textarea, VStack, Heading, Text, Field } from "@chakra-ui/react";
import { toaster } from "@/Components/themes/ui/toaster";

export default function StoriesEdit({ story }) {
    const { data, setData, put, processing, errors } = useForm({
        subject: story.subject,
        description: story.description || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('stories.update', story.id), {
            onSuccess: () => {
                toaster.create({ title: "Story updated successfully", type: "success" });
            }
        });
    };

    return (
        <AuthenticatedLayout header={<Heading size="md" className="text-xl font-semibold leading-tight text-gray-800">Edit Story</Heading>}>
            <Head title="Edit Story" />
            <Box maxW="7xl" mx="auto" py={6} px={{ base: 2, sm: 6, lg: 8 }}>
                <Box bg="white" p={6} rounded="lg" shadow="sm">
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="stretch">
                            <Field.Root required invalid={!!errors.subject}>
                                <Field.Label>Subject</Field.Label>
                                <Input value={data.subject} onChange={e => setData("subject", e.target.value)} />
                                {errors.subject && <Field.ErrorText>{errors.subject}</Field.ErrorText>}
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Description</Field.Label>
                                <Textarea value={data.description} onChange={e => setData("description", e.target.value)} rows={6} />
                                {errors.description && <Field.ErrorText>{errors.description}</Field.ErrorText>}
                            </Field.Root>

                            <Box>
                                <Button type="submit" colorPalette="blue" isLoading={processing}>Update Story</Button>
                                <Link href={route('stories.index')} className="ml-4">
                                    <Button variant="ghost">Cancel</Button>
                                </Link>
                            </Box>
                        </VStack>
                    </form>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
