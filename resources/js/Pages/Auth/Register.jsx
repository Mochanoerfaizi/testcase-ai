"use client"

import { Head, Link, useForm } from "@inertiajs/react"
import {
    VStack,
    Field,
    Input,
    Button,
    Text,
    HStack,
} from "@chakra-ui/react"
import GuestLayout from "@/Layouts/GuestLayout"

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    })

    const submit = (e) => {
        e.preventDefault()
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        })
    }

    return (
        <GuestLayout>
            <Head title="Register" />

            <VStack
                as="form"
                onSubmit={submit}
                spacing={6}
                align="stretch"
                w="full"
            >
                {/* Name */}
                <Field.Root invalid={!!errors.name}>
                    <Field.Label>Name</Field.Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        autoComplete="name"
                        autoFocus
                        required
                    />
                    {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                </Field.Root>

                {/* Email */}
                <Field.Root invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="username"
                        required
                    />
                    {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                </Field.Root>

                {/* Password */}
                <Field.Root invalid={!!errors.password}>
                    <Field.Label>Password</Field.Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    {errors.password && (
                        <Field.ErrorText>{errors.password}</Field.ErrorText>
                    )}
                </Field.Root>

                {/* Confirm Password */}
                <Field.Root invalid={!!errors.password_confirmation}>
                    <Field.Label>Confirm Password</Field.Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        autoComplete="new-password"
                        required
                    />
                    {errors.password_confirmation && (
                        <Field.ErrorText>{errors.password_confirmation}</Field.ErrorText>
                    )}
                </Field.Root>

                {/* Actions */}
                <HStack justify="flex-end" spacing={4}>
                    <Link href={route("login")}>
                        <Text
                            as="span"
                            fontSize="sm"
                            color="fg.muted"
                            textDecoration="underline"
                            _hover={{ color: "fg" }}
                        >
                            Already registered?
                        </Text>
                    </Link>

                    <Button type="submit" colorPalette="blue" loading={processing}>
                        Register
                    </Button>
                </HStack>
            </VStack>
        </GuestLayout>
    )
}
