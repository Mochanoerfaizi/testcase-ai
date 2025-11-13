"use client"

import React from "react"
import {
    Button,
    Fieldset,
    Input,
    NativeSelect,
    Text,
    VStack,
    Box,
    Spinner,
    HStack,
    Checkbox as ChakraCheckbox,
} from "@chakra-ui/react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import FormField from "@/Components/FormInput"
import { useAllRoles } from "@/Hooks/Services/useUsers"

const createSchema = yup.object({
    name: yup.string().required("Nama harus diisi").max(255),
    email: yup.string().required("Email harus diisi").email("Format email tidak valid"),
    password: yup.string().required("Password harus diisi").min(8, "Password minimal 8 karakter"),
    is_active: yup.boolean(),
    roles: yup.array(),
})

const updateSchema = yup.object({
    name: yup.string().required("Nama harus diisi").max(255),
    email: yup.string().required("Email harus diisi").email("Format email tidak valid"),
    password: yup.string()
        .transform((value, originalValue) => {
            // Convert empty string to undefined so it passes validation
            return originalValue === '' ? undefined : value;
        })
        .nullable()
        .min(8, "Password minimal 8 karakter"),
    is_active: yup.boolean(),
    roles: yup.array(),
})

export default function UserFormFields({
    defaultValues,
    onSubmit,
    isLoading,
}) {
    const isEditMode = !!defaultValues?.id
    const { data: allRoles, isLoading: loadingRoles } = useAllRoles()
    
    // State lokal untuk checkbox roles
    const [selectedRoles, setSelectedRoles] = React.useState([])

    const methods = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            is_active: true,
            roles: [],
        },
        resolver: yupResolver(isEditMode ? updateSchema : createSchema),
        mode: "onChange",
    })

    // Reset form when defaultValues changes (for edit mode)
    React.useEffect(() => {
        if (defaultValues) {
            const roles = defaultValues.roles?.map(r => r.name) || []
            methods.reset({
                name: defaultValues.name || "",
                email: defaultValues.email || "",
                password: "",
                is_active: defaultValues.is_active ?? true,
                roles: roles,
            })
            setSelectedRoles(roles)
        }
    }, [defaultValues, methods])

    // Sync selectedRoles with form when roles change
    React.useEffect(() => {
        if (methods.getValues('roles') !== selectedRoles) {
            methods.setValue('roles', selectedRoles)
        }
    }, [selectedRoles, methods])

    const submitHandler = (values) => {
        // Hapus password jika kosong saat edit
        if (isEditMode && !values.password) {
            delete values.password
        }
        onSubmit?.(values)
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(submitHandler)}>
                <Fieldset.Root size="lg" maxW="md">
                    <Fieldset.Content>
                        {/* Name */}
                        <FormField name="name" label="Nama">
                            <Input
                                {...methods.register("name")}
                                placeholder="Masukkan nama lengkap"
                            />
                        </FormField>

                        {/* Email */}
                        <FormField name="email" label="Email">
                            <Input
                                {...methods.register("email")}
                                type="email"
                                placeholder="user@example.com"
                            />
                        </FormField>

                        {/* Password */}
                        <FormField name="password" label={isEditMode ? "Password (kosongkan jika tidak diubah)" : "Password"}>
                            <Input
                                {...methods.register("password")}
                                type="password"
                                placeholder={isEditMode ? "Kosongkan jika tidak ingin mengubah" : "Minimal 8 karakter"}
                            />
                            {isEditMode && (
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Kosongkan jika tidak ingin mengubah password
                                </Text>
                            )}
                        </FormField>

                        {/* Roles */}
                        <FormField name="roles" label="Roles">
                            {loadingRoles ? (
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Spinner size="sm" />
                                    <Text fontSize="sm">Loading roles...</Text>
                                </Box>
                            ) : (
                                <Controller
                                    name="roles"
                                    control={methods.control}
                                    render={({ field }) => {
                                        return (
                                            <VStack align="start" gap={2}>
                                                {allRoles && allRoles.length > 0 ? (
                                                    allRoles.map((role) => (
                                                        <HStack key={`role-${role.id}`} gap={3}>
                                                            <Box
                                                                as="input"
                                                                type="checkbox"
                                                                checked={selectedRoles.includes(role.name)}
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked
                                                                    let newValue = [...selectedRoles]
                                                                    
                                                                    if (checked) {
                                                                        // Tambahkan role jika belum ada
                                                                        if (!newValue.includes(role.name)) {
                                                                            newValue = [...newValue, role.name]
                                                                        }
                                                                    } else {
                                                                        // Hapus role jika ada
                                                                        newValue = newValue.filter((r) => r !== role.name)
                                                                    }
                                                                    
                                                                    setSelectedRoles(newValue)
                                                                }}
                                                                sx={{
                                                                    width: '16px',
                                                                    height: '16px',
                                                                    border: '1px solid',
                                                                    borderColor: 'gray.300',
                                                                    borderRadius: '4px',
                                                                    backgroundColor: selectedRoles.includes(role.name) ? 'blue.600' : 'white',
                                                                    cursor: 'pointer',
                                                                    appearance: 'none',
                                                                    position: 'relative',
                                                                    '&:hover': {
                                                                        borderColor: 'gray.400'
                                                                    },
                                                                    '&:checked': {
                                                                        backgroundColor: 'blue.600',
                                                                        borderColor: 'blue.600',
                                                                        '&::after': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            left: '4px',
                                                                            top: '1px',
                                                                            width: '4px',
                                                                            height: '8px',
                                                                            border: 'solid white',
                                                                            borderWidth: '0 2px 2px 0',
                                                                            transform: 'rotate(45deg)'
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <Text 
                                                                fontSize="sm" 
                                                                color="gray.900"
                                                                cursor="pointer"
                                                                onClick={() => {
                                                                    const checked = !selectedRoles.includes(role.name)
                                                                    let newValue = [...selectedRoles]
                                                                    
                                                                    if (checked) {
                                                                        // Tambahkan role jika belum ada
                                                                        if (!newValue.includes(role.name)) {
                                                                            newValue = [...newValue, role.name]
                                                                        }
                                                                    } else {
                                                                        // Hapus role jika ada
                                                                        newValue = newValue.filter((r) => r !== role.name)
                                                                    }
                                                                    
                                                                    setSelectedRoles(newValue)
                                                                }}
                                                            >
                                                                {role.name}
                                                            </Text>
                                                        </HStack>
                                                    ))
                                                ) : (
                                                    <Text fontSize="sm" color="gray.500">
                                                        No roles available
                                                    </Text>
                                                )}
                                            </VStack>
                                        )
                                    }}
                                />
                            )}
                        </FormField>

                        {/* Status */}
                        <FormField name="is_active" label="Status">
                            <NativeSelect.Root size="md">
                                <NativeSelect.Field {...methods.register("is_active")}>
                                    <option value="true">Aktif</option>
                                    <option value="false">Non-Aktif</option>
                                </NativeSelect.Field>
                            </NativeSelect.Root>
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
