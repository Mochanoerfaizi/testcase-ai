import React from "react";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogCloseTrigger,
} from "@/Components/themes/ui/dialog";
import PermissionFormFields from "./PermissionFormFields";

export default function PermissionForm({ isOpen, onClose, permission = null }) {
    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) onClose();
            }}
            size="md"
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {permission ? "Edit Permission" : "Add New Permission"}
                    </DialogTitle>
                </DialogHeader>
                <DialogCloseTrigger />
                <DialogBody>
                    <PermissionFormFields permission={permission} onClose={onClose} />
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    );
}
