"use client"

import {
    Dialog,
    Portal,
    Stack,
    createOverlay,
    Flex,
    CloseButton,
} from "@chakra-ui/react"
import * as React from "react"
import DataProducerFormFields from "./DataProducerFormFields"

const DataProducerForm = createOverlay((props) => {
    const { title, initialData, onSubmit, isLoading, ...rest } = props
    const [portalEl, setPortalEl] = React.useState(null) // ⬅️ simpan elemen DOM

    return (
        <Dialog.Root {...rest} motionPreset="none">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content ref={setPortalEl}>
                        {title && (
                            <Dialog.Header>
                                <Flex justify="space-between" align="center" w="full">
                                    <Dialog.Title>{title}</Dialog.Title>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" />
                                    </Dialog.CloseTrigger>
                                </Flex>
                            </Dialog.Header>
                        )}

                        <Dialog.Body>
                            <Stack gap="4">
                                <DataProducerFormFields
                                    defaultValues={initialData}
                                    onSubmit={(values) => {
                                        onSubmit?.(values)
                                    }}
                                    isLoading={isLoading}
                                    portalContainer={portalEl} // ⬅️ arahkan dropdown ke dalam Content
                                />
                            </Stack>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
})

export default DataProducerForm
