import {Head} from "@inertiajs/react"

import {Button, Heading} from "@/Components/themes/ui"
import {Flex, Container, VStack, Text, Show} from "@chakra-ui/react";

function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />

            <Container
                maxW="full"
                minH="100vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="bg.subtle"     // pakai semantic token
            >
                <VStack
                    gap={4}
                    p={10}
                    rounded="2xl"
                    shadow="xl"
                    bg="bg.panel"
                    textAlign="center"
                >
                    <Heading
                        size="2xl"
                    >
                        Selamat Datang, {auth.user ? auth.user.name : ''}!
                    </Heading>

                    <Text fontSize="lg" color="fg.muted">
                        Ini adalah boilerplate project React + Chakra UI v3. <br />
                        Bangun antarmuka dengan lebih cepat, aksesibel, dan konsisten.
                    </Text>

                    <Flex
                        gap="3"
                    >


                        <Show when={!auth.user}>
                            <Button
                                size="lg"
                                variant="solid"
                                colorPalette="teal"
                                rounded="full"
                                as="a"
                                href={route('login')}
                            >
                                Try Login 🚀
                            </Button>
                        </Show>

                        <Show when={auth.user}>
                            <Button
                                size="lg"
                                variant="solid"
                                colorPalette="teal"
                                rounded="full"
                                as="a"
                                href={route('login')}
                            >
                                Go to Dashboard 🚀
                            </Button>
                        </Show>

                    </Flex>
                </VStack>
            </Container>
        </>
    )
}

export default Welcome
