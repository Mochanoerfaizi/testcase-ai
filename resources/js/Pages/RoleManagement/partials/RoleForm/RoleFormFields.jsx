import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box,
    Button,
    Input,
    Stack,
    Text,
    Grid,
    Heading,
    Spinner,
} from "@chakra-ui/react";
import { Field } from "@/Components/themes/ui/field";
import { Checkbox } from "@/Components/themes/ui/checkbox";
import { toaster } from "@/Components/themes/ui/toaster";
import {
    useCreateRole,
    useUpdateRole,
    useAllPermissions,
} from "@/Hooks/Services/useRoles";

const roleSchema = yup.object().shape({
    name: yup.string().required("Role name is required"),
    permissions: yup.array().min(1, "At least one permission is required"),
});

export default function RoleFormFields({ role, onClose }) {
    const isEdit = !!role;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(roleSchema),
        defaultValues: {
            name: role?.name || "",
            permissions: role?.permissions?.map((p) => p.name) || [],
        },
    });

    const selectedPermissions = watch("permissions");

    const { data: allPermissions, isLoading: loadingPermissions } = useAllPermissions();

    const createRole = useCreateRole({
        onSuccess: () => {
            toaster.create({
                title: "Role created successfully",
                type: "success",
            });
            onClose();
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to create role",
                description: error?.response?.data?.message || "An error occurred",
                type: "error",
            });
        },
    });

    const updateRole = useUpdateRole({
        onSuccess: () => {
            toaster.create({
                title: "Role updated successfully",
                type: "success",
            });
            onClose();
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to update role",
                description: error?.response?.data?.message || "An error occurred",
                type: "error",
            });
        },
    });

    const onSubmit = (data) => {
        if (isEdit) {
            updateRole.mutate({ id: role.id, ...data });
        } else {
            createRole.mutate(data);
        }
    };

    // Group permissions by module
    const groupedPermissions = React.useMemo(() => {
        if (!allPermissions) return {};

        const groups = {};
        allPermissions.forEach((permission) => {
            const parts = permission.name.split(".");
            const module = parts[0]; // e.g., "users", "dashboard"
            const action = parts[1]; // e.g., "create", "read", "update"

            if (!groups[module]) {
                groups[module] = [];
            }
            groups[module].push({
                name: permission.name,
                action: action,
            });
        });

        return groups;
    }, [allPermissions]);

    const handleSelectAll = (module, permissions) => {
        const modulePermissionNames = permissions.map((p) => p.name);
        const allSelected = modulePermissionNames.every((p) =>
            selectedPermissions.includes(p)
        );

        if (allSelected) {
            // Deselect all in this module
            setValue(
                "permissions",
                selectedPermissions.filter(
                    (p) => !modulePermissionNames.includes(p)
                )
            );
        } else {
            // Select all in this module
            setValue("permissions", [
                ...new Set([...selectedPermissions, ...modulePermissionNames]),
            ]);
        }
    };

    // Helper function to format module name for display
    const formatModuleName = (module) => {
        return module
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (loadingPermissions) {
        return (
            <Box textAlign="center" py={8}>
                <Spinner size="xl" />
                <Text mt={4}>Loading permissions...</Text>
            </Box>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
                <Field
                    label="Role Name"
                    invalid={!!errors.name}
                    errorText={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter role name"
                            />
                        )}
                    />
                </Field>

                <Box>
                    <Text fontWeight="semibold" mb={3}>
                        Permissions
                    </Text>
                    {errors.permissions && (
                        <Text color="red.500" fontSize="sm" mb={2}>
                            {errors.permissions.message}
                        </Text>
                    )}

                    <Stack gap={4}>
                        {Object.entries(groupedPermissions).map(
                            ([module, permissions]) => {
                                const modulePermissionNames = permissions.map(
                                    (p) => p.name
                                );
                                const allSelected = modulePermissionNames.every(
                                    (p) => selectedPermissions.includes(p)
                                );

                                return (
                                    <Box
                                        key={module}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        p={4}
                                    >
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={3}
                                        >
                                            <Heading size="sm">
                                                {formatModuleName(module)}
                                            </Heading>
                                            <Button
                                                size="xs"
                                                variant="ghost"
                                                colorScheme="blue"
                                                onClick={() =>
                                                    handleSelectAll(
                                                        module,
                                                        permissions
                                                    )
                                                }
                                            >
                                                {allSelected
                                                    ? "Deselect All"
                                                    : "Select All"}
                                            </Button>
                                        </Box>
                                        <Grid
                                            templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
                                            gap={2}
                                        >
                                            {permissions.map((permission) => (
                                                <Controller
                                                    key={permission.name}
                                                    name="permissions"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Checkbox
                                                            checked={field.value?.includes(
                                                                permission.name
                                                            )}
                                                            onCheckedChange={(
                                                                e
                                                            ) => {
                                                                const checked =
                                                                    e.checked;
                                                                if (checked) {
                                                                    field.onChange(
                                                                        [
                                                                            ...field.value,
                                                                            permission.name,
                                                                        ]
                                                                    );
                                                                } else {
                                                                    field.onChange(
                                                                        field.value.filter(
                                                                            (
                                                                                p
                                                                            ) =>
                                                                                p !==
                                                                                permission.name
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Text
                                                                fontSize="sm"
                                                                textTransform="capitalize"
                                                            >
                                                                {
                                                                    permission.action.replace("-", " ")
                                                                }
                                                            </Text>
                                                        </Checkbox>
                                                    )}
                                                />
                                            ))}
                                        </Grid>
                                    </Box>
                                );
                            }
                        )}
                    </Stack>
                </Box>

                <Box display="flex" justifyContent="flex-end" gap={3} mt={4}>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        loading={isSubmitting}
                    >
                        {isEdit ? "Update" : "Create"} Role
                    </Button>
                </Box>
            </Stack>
        </form>
    );
}
