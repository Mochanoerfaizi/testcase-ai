"use client"

import React from "react"
import {
    Button,
    Fieldset,
    Input,
    Textarea,
    NativeSelect,
    Box,
    Spinner,
    Text,
} from "@chakra-ui/react"
import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import FormField from "@/Components/FormInput"
import { useTaigaProjects } from "@/Hooks/Services/useTaiga"

const schema = yup.object({
    name: yup.string().required("Nama product harus diisi").max(255),
    description: yup.string().nullable(),
    url: yup.string()
        .nullable()
        .url("Format URL tidak valid")
        .max(2048, "URL terlalu panjang"),
    taiga_project_id: yup.string().nullable(),
})

export default function ProductFormFields({
    defaultValues,
    onSubmit,
    isLoading,
}) {
    const isEditMode = !!defaultValues?.id
    const { data: taigaProjects, isLoading: loadingTaigaProjects } = useTaigaProjects()

    const methods = useForm({
        defaultValues: {
            name: "",
            description: "",
            url: "",
            taiga_project_id: "",
            taiga_project_name: "",
        },
        resolver: yupResolver(schema),
        mode: "onChange",
    })

    // Reset form when defaultValues changes (for edit mode)
    React.useEffect(() => {
        if (defaultValues) {
            methods.reset({
                name: defaultValues.name || "",
                description: defaultValues.description || "",
                url: defaultValues.url || "",
                taiga_project_id: defaultValues.taiga_project_id || "",
                taiga_project_name: defaultValues.taiga_project_name || "",
            })
        }
    }, [defaultValues, methods])

    const submitHandler = (values) => {
        onSubmit?.(values)
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(submitHandler)}>
                <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Content>
                        {/* Name */}
                        <FormField name="name" label="Nama Product">
                            <Input
                                {...methods.register("name")}
                                placeholder="Masukkan nama product"
                            />
                        </FormField>

                        {/* Description */}
                        <FormField name="description" label="Deskripsi">
                            <Textarea
                                {...methods.register("description")}
                                placeholder="Masukkan deskripsi product (opsional)"
                                rows={4}
                            />
                        </FormField>

                        {/* URL */}
                        <FormField name="url" label="URL">
                            <Input
                                {...methods.register("url")}
                                type="url"
                                placeholder="https://example.com (opsional)"
                            />
                        </FormField>

                        {/* Taiga Project */}
                        <FormField name="taiga_project_id" label="Taiga Project">
                            {loadingTaigaProjects ? (
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Spinner size="sm" />
                                    <Text fontSize="sm">Loading projects...</Text>
                                </Box>
                            ) : (
                                <NativeSelect.Root size="md">
                                    <NativeSelect.Field
                                        {...methods.register("taiga_project_id")}
                                        onChange={(e) => {
                                            const selectedId = e.target.value
                                            const selectedProject = taigaProjects?.find(
                                                (p) => p.id.toString() === selectedId
                                            )
                                            methods.setValue("taiga_project_id", selectedId)
                                            methods.setValue(
                                                "taiga_project_name",
                                                selectedProject?.name || ""
                                            )
                                        }}
                                    >
                                        <option value="">-- Pilih Project (Opsional) --</option>
                                        {taigaProjects && taigaProjects.length > 0 ? (
                                            taigaProjects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>
                                                No projects available
                                            </option>
                                        )}
                                    </NativeSelect.Field>
                                </NativeSelect.Root>
                            )}
                        </FormField>
                        
                    </Fieldset.Content>

                    {/* Submit */}
                    <Button
                        type="submit"
                        colorScheme="blue"
                        alignSelf="flex-end"
                        isLoading={isLoading}
                    >
                        Simpan
                    </Button>
                </Fieldset.Root>
            </form>
        </FormProvider>
    )
}
