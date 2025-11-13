"use client"

import {
    Button,
    Fieldset,
    Input,
    Textarea,
    NativeSelect,
} from "@chakra-ui/react"
import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import FormField from "@/Components/FormInput"

const schema = yup.object({
    name: yup.string().required("Name is required").max(255),
    classification: yup.string().required("Classification is required"),
    description: yup.string().nullable(),
})

export default function DataProducerFormFields({
                                                   defaultValues,
                                                   onSubmit,
                                                   isLoading,
                                               }) {
    const methods = useForm({
        defaultValues: defaultValues || {
            name: "",
            classification: "",
            description: "",
        },
        resolver: yupResolver(schema),
        mode: "onChange",
    })

    const submitHandler = (values) => {
        onSubmit?.(values)
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(submitHandler)}>
                <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Content>
                        {/* Name */}
                        <FormField name="name" label="Name">
                            <Input
                                {...methods.register("name")}
                                placeholder="Data producer name"
                            />
                        </FormField>

                        {/* Classification (pakai NativeSelect Chakra v3) */}
                        <FormField name="classification" label="Classification">
                            <NativeSelect.Root size="md">
                                <NativeSelect.Field {...methods.register("classification")}>
                                    <option value="">Select classification</option>
                                    <option value="internal">Internal</option>
                                    <option value="eksternal">Eksternal</option>
                                </NativeSelect.Field>
                            </NativeSelect.Root>
                        </FormField>

                        {/* Description */}
                        <FormField name="description" label="Description">
                            <Textarea
                                {...methods.register("description")}
                                placeholder="Description"
                            />
                        </FormField>
                    </Fieldset.Content>

                    {/* Submit */}
                    <Button
                        type="submit"
                        colorScheme="blue"
                        alignSelf="flex-end"
                        isLoading={isLoading}
                    >
                        Save
                    </Button>
                </Fieldset.Root>
            </form>
        </FormProvider>
    )
}
