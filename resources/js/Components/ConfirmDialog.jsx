"use client"

import {
    Button,
    Dialog,
    Portal,
} from "@chakra-ui/react"

export function ConfirmDialog({
                                  open,
                                  onOpenChange,
                                  title = "Konfirmasi",
                                  message = "Apakah kamu yakin?",
                                  confirmText = "OK",
                                  cancelText = "Batal",
                                  colorScheme = "blue", // bisa diganti "red" untuk delete
                                  isLoading = false,
                                  onConfirm,
                                  onCancel,
                              }) {
    return (
        <Dialog.Root role="alertdialog" open={open} onOpenChange={onOpenChange} placement="center">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {message}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        onCancel?.()
                                    }}
                                >
                                    {cancelText}
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorScheme={colorScheme}
                                isLoading={isLoading}
                                onClick={() => {
                                    onConfirm?.()
                                }}
                            >
                                {confirmText}
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
