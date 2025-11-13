import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box,
    Button,
    Input,
    Stack,
} from "@chakra-ui/react";
import { Field } from "@/Components/themes/ui/field";
import { toaster } from "@/Components/themes/ui/toaster";
import {
    useCreatePermission,
    useUpdatePermission,
} from "@/Hooks/Services/usePermissions";

const permissionSchema = yup.object().shape({
    name: yup
        .string()
        .required("Permission name is required")
        .matches(
            /^[a-z0-9-]+\.(create|read|update|delete|toggle-status)$/,
            "Permission name must be in format: module.action (e.g., users.read, users.toggle-status)"
        ),
});

export default function PermissionFormFields({ permission, onClose }) {
    const isEdit = !!permission;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(permissionSchema),
        defaultValues: {
            name: permission?.name || "",
        },
    });

    const createPermission = useCreatePermission({
        onSuccess: () => {
            toaster.create({
                title: "Permission created successfully",
                type: "success",
            });
            onClose();
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to create permission",
                description: error?.response?.data?.message || "An error occurred",
                type: "error",
            });
        },
    });

    const updatePermission = useUpdatePermission({
        onSuccess: () => {
            toaster.create({
                title: "Permission updated successfully",
                type: "success",
            });
            onClose();
        },
        onError: (error) => {
            toaster.create({
                title: "Failed to update permission",
                description: error?.response?.data?.message || "An error occurred",
                type: "error",
            });
        },
    });

    const onSubmit = (data) => {
        if (isEdit) {
            updatePermission.mutate({ id: permission.id, ...data });
        } else {
            createPermission.mutate(data);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
                <Field
                    label="Permission Name"
                    invalid={!!errors.name}
                    errorText={errors.name?.message}
                    helperText="Format: module.action (e.g., users.read, roles.create, users.toggle-status)"
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="e.g., users.read"
                            />
                        )}
                    />
                </Field>

                <Box display="flex" justifyContent="flex-end" gap={3} mt={4}>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        loading={isSubmitting}
                    >
                        {isEdit ? "Update" : "Create"} Permission
                    </Button>
                </Box>
            </Stack>
        </form>
    );
}
